package com.devtalk.controller;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.DeliveryAckDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.messages.MessageEditDTO;
import com.devtalk.dto.messages.MessageDeleteDTO;
import com.devtalk.dto.messages.TypingDTO;
import com.devtalk.dto.messages.ReadReceiptDTO;
import com.devtalk.dto.messages.PingPongMessageDTO;
import com.devtalk.dto.messages.MessageReactionDTO;
import com.devtalk.dto.messages.AttachmentDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.service.ChannelService;
import com.devtalk.service.MessageService;
import com.devtalk.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chat", description = "Chat API")
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;
    private final UserService userService;
    private final ChannelService channelService;

    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    @Operation(summary = "Handle ping message", description = "Handles the ping message and returns a pong message")
    @ApiResponse(responseCode = "200", description = "Pong message sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public PingPongMessageDTO handlePing(MessageBaseDTO pingMessage, Principal principal) {
        //String user = principal != null ? principal.getName() : "Unknown"; - this is not used
        return PingPongMessageDTO.builder()
                .userId(pingMessage.getUserId())
                .channelId(pingMessage.getChannelId())
                .threadId(pingMessage.getThreadId())
                .type("PONG")
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @MessageMapping("/chat.send")
    @Operation(summary = "Handle chat message", description = "Handles the chat message and sends it to the destination")
    @ApiResponse(responseCode = "200", description = "Message sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleChat(ChatMessageDTO message, Principal principal) {
        if(message == null || message.getDestination() == null) {
            log.warn("Received null message or destination");
            return;
        }
        try {
            if (message.getUserId() == null) {
                log.warn("Message received without userId");
                sendErrorToUser(principal, "UserId is required");
                return;
            }
            UserResponseDTO user = userService.getUserDTOById(message.getUserId());

            if (message.getChannelId() == null) {
                log.warn("Message received without channelId");
                sendErrorToUser(principal, "ChannelId is required");
                return;
            }
            ChannelResponseDTO channel = channelService.getChannelDTOById(message.getChannelId());
            MessageResponseDTO savedMessage = messageService.saveMessage(message, user, channel);
            simpMessagingTemplate.convertAndSend(message.getDestination(), savedMessage);
            log.info("Broadcasted message {} from user {} to {}", savedMessage.getId(), user.getDisplayName(), message.getDestination());

            // Send delivery confirmation to the sender (all active sessions)
            if (principal != null) {
                String username = principal.getName();
                DeliveryAckDTO ack = new DeliveryAckDTO();
                ack.setStatus("DELIVERED");
                ack.setServerTimestamp(System.currentTimeMillis());
                ack.setChannelId(savedMessage.getChannelId());
                ack.setMessageId(savedMessage.getId());
                ack.setUserId(savedMessage.getUserId());
                simpMessagingTemplate.convertAndSendToUser(username, "/queue/acks", ack);
            }

        } catch (RuntimeException e) {
            log.error("Error handling chat message: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error sending message: " + e.getMessage());
        }
    }

    @MessageMapping("/message.react")
    @Operation(summary = "Add reaction", description = "Adds a reaction to a message and broadcasts it")
    public void react(MessageReactionDTO dto) {
        if (dto == null || dto.getMessageId() == null || dto.getUserId() == null || dto.getChannelId() == null || dto.getReactionType() == null) { return; }
        messageService.addReaction(dto.getMessageId(), dto.getUserId(), dto.getReactionType());
        simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    @MessageMapping("/message.unreact")
    @Operation(summary = "Remove reaction", description = "Removes a reaction from a message and broadcasts it")
    public void unreact(MessageReactionDTO dto) {
        if (dto == null || dto.getMessageId() == null || dto.getUserId() == null || dto.getChannelId() == null || dto.getReactionType() == null) { return; }
        messageService.removeReaction(dto.getMessageId(), dto.getUserId(), dto.getReactionType());
        simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    @MessageMapping("/message.attach")
    @Operation(summary = "Attach file", description = "Attaches a file to a message and broadcasts updated message")
    public void attach(AttachmentDTO dto) {
        if (dto == null || dto.getMessageId() == null || dto.getChannelId() == null) { return; }
        var updated = messageService.addAttachment(dto);
        simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), updated);
    }

    @MessageMapping("/chat.edit")
    @Operation(summary = "Edit chat message", description = "Edits an existing message and broadcasts the update")
    public void handleEdit(MessageEditDTO edit, Principal principal) {
        if (edit == null || edit.getMessageId() == null || edit.getChannelId() == null || edit.getUserId() == null) {
            sendErrorToUser(principal, "Invalid edit payload");
            return;
        }
        try {
            var updated = messageService.editMessage(edit.getMessageId(), edit.getContent(), edit.getUserId());
            var response = messageService.getMessageById(updated.getId());
            simpMessagingTemplate.convertAndSend("/topic/room/" + edit.getChannelId(), response);
        } catch (RuntimeException e) {
            log.error("Edit failed: {}", e.getMessage());
            sendErrorToUser(principal, "Edit failed: " + e.getMessage());
        }
    }

    @MessageMapping("/chat.delete")
    @Operation(summary = "Delete chat message", description = "Deletes a message and broadcasts a tombstone event")
    public void handleDelete(MessageDeleteDTO del, Principal principal) {
        if (del == null || del.getMessageId() == null || del.getChannelId() == null || del.getUserId() == null) {
            sendErrorToUser(principal, "Invalid delete payload");
            return;
        }
        try {
            messageService.deleteMessage(del.getMessageId(), del.getUserId());
            simpMessagingTemplate.convertAndSend("/topic/room/" + del.getChannelId(),
                    PingPongMessageDTO.builder().type("MESSAGE_DELETED").threadId(null).channelId(del.getChannelId())
                            .userId(del.getUserId()).messageId(del.getMessageId()).timestamp(System.currentTimeMillis()).build());
        } catch (RuntimeException e) {
            log.error("Delete failed: {}", e.getMessage());
            sendErrorToUser(principal, "Delete failed: " + e.getMessage());
        }
    }

    @MessageMapping("/typing.start")
    @Operation(summary = "Typing start", description = "Broadcast typing start event")
    public void typingStart(TypingDTO dto) {
        if (dto == null || dto.getChannelId() == null || dto.getUserId() == null) {
            log.warn("Received invalid TypingDTO in typingStart: {}", dto);
            return;
        }
        simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    @MessageMapping("/typing.stop")
    @Operation(summary = "Typing stop", description = "Broadcast typing stop event")
    public void typingStop(TypingDTO dto) {
        if (dto == null || dto.getChannelId() == null || dto.getUserId() == null) {
            log.warn("Received invalid TypingDTO in typingStop: {}", dto);
            return;
        }
        simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    @MessageMapping("/message.read")
    @Operation(summary = "Read receipt", description = "Broadcast single read receipt")
    public void readReceipt(ReadReceiptDTO dto) {
        if (dto == null || dto.getChannelId() == null || dto.getMessageId() == null || dto.getUserId() == null) {
            log.warn("Invalid ReadReceiptDTO received: {}", dto);
            return;
        }
        if (dto.getReadAt() == null) { dto.setReadAt(System.currentTimeMillis()); }
        simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    @MessageMapping("/message.history")
    @Operation(summary = "Handle message history", description = "Handles the message history request and sends it to the user")
    @ApiResponse(responseCode = "200", description = "Message history sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleMessageHistory(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getChannelId() == null) {
                log.warn("History request without channelId from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "ChannelId is required");
                return;
            }

            List<MessageResponseDTO> messages;
            if (request.getBeforeTimestamp() != null && request.getBeforeTimestamp() > 0) {
                messages = messageService.getChannelMessagesBefore(request.getChannelId(), request.getBeforeTimestamp(), 50);
            } else {
                messages = messageService.getChannelMessages(request.getChannelId(), 50);
            }

            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/history", messages);
            log.info("Sent {} messages history for channel {} to user {}", messages.size(), request.getChannelId(), username);

        } catch (RuntimeException e) {
            log.error("Error retrieving message history: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error retrieving history: " + e.getMessage());
        }
    }

    @Operation(summary = "Send error to user", description = "Sends an error message to the user")
    @ApiResponse(responseCode = "200", description = "Error message sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    private void sendErrorToUser(Principal principal, String errorMessage) {
        String username = principal != null ? principal.getName() : "Unknown";
        simpMessagingTemplate.convertAndSendToUser(username, "/queue/errors", errorMessage);
    }
}
