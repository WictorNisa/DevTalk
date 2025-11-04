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
import com.devtalk.dto.messages.MentionNotificationDTO;
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

            // Send notifications to mentioned users
            if (savedMessage.getMentionedUserIds() != null && !savedMessage.getMentionedUserIds().isEmpty()) {
                for (Long mentionedUserId : savedMessage.getMentionedUserIds()) {
                    // Don't notify the sender if they mentioned themselves
                    if (!mentionedUserId.equals(savedMessage.getUserId())) {
                        UserResponseDTO mentionedUser = userService.getUserDTOById(mentionedUserId);
                        String preview = savedMessage.getContent() != null && savedMessage.getContent().length() > 100 
                                ? savedMessage.getContent().substring(0, 100) + "..." 
                                : savedMessage.getContent();
                        
                        MentionNotificationDTO notification = MentionNotificationDTO.builder()
                                .mentionedUserId(mentionedUserId)
                                .mentionedUserName(mentionedUser.getDisplayName())
                                .senderDisplayName(user.getDisplayName())
                                .senderAvatarUrl(user.getAvatarUrl())
                                .channelName(channel.getName())
                                .channelId(savedMessage.getChannelId())
                                .messageId(savedMessage.getId())
                                .userId(savedMessage.getUserId())
                                .messagePreview(preview)
                                .timestamp(savedMessage.getTimestamp())
                                .build();
                        
                        // Send to mentioned user's personal queue
                        simpMessagingTemplate.convertAndSendToUser(mentionedUser.getExternalId(), "/queue/notifications", notification);
                        log.info("Sent mention notification to user {} for message {}", mentionedUser.getDisplayName(), savedMessage.getId());
                    }
                }
            }

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

    @MessageMapping("/thread.replies")
    @Operation(summary = "Get thread replies", description = "Retrieves all replies for a parent message (thread)")
    @ApiResponse(responseCode = "200", description = "Thread replies retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleThreadReplies(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getParentMessageId() == null) {
                log.warn("Thread replies request without parentMessageId from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "ParentMessageId is required");
                return;
            }

            List<MessageResponseDTO> replies = messageService.getThreadReplies(request.getParentMessageId());
            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/thread/replies", replies);
            log.info("Sent {} thread replies for parent message {} to user {}", replies.size(), request.getParentMessageId(), username);

        } catch (RuntimeException e) {
            log.error("Error retrieving thread replies: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error retrieving thread replies: " + e.getMessage());
        }
    }

    @MessageMapping("/thread.messages")
    @Operation(summary = "Get thread messages", description = "Retrieves all messages in a thread by thread ID")
    @ApiResponse(responseCode = "200", description = "Thread messages retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleThreadMessages(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getThreadId() == null) {
                log.warn("Thread messages request without threadId from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "ThreadId is required");
                return;
            }

            List<MessageResponseDTO> messages = messageService.getThreadMessages(request.getThreadId());
            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/thread/messages", messages);
            log.info("Sent {} messages for thread {} to user {}", messages.size(), request.getThreadId(), username);

        } catch (RuntimeException e) {
            log.error("Error retrieving thread messages: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error retrieving thread messages: " + e.getMessage());
        }
    }

    @MessageMapping("/thread.list")
    @Operation(summary = "Get channel threads", description = "Retrieves all threads in a channel")
    @ApiResponse(responseCode = "200", description = "Channel threads retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleChannelThreads(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getChannelId() == null) {
                log.warn("Thread list request without channelId from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "ChannelId is required");
                return;
            }

            List<MessageResponseDTO> threads = messageService.getChannelThreads(request.getChannelId());
            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/thread/list", threads);
            log.info("Sent {} threads for channel {} to user {}", threads.size(), request.getChannelId(), username);

        } catch (RuntimeException e) {
            log.error("Error retrieving channel threads: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error retrieving channel threads: " + e.getMessage());
        }
    }

    @MessageMapping("/message.search")
    @Operation(summary = "Search messages", description = "Searches for messages containing the query text")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleMessageSearch(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                log.warn("Search request without query from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "Search query is required");
                return;
            }

            int limit = 50; // Default limit
            List<MessageResponseDTO> results = messageService.searchMessages(request.getContent(), limit);
            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/search", results);
            log.info("Sent {} search results for query '{}' to user {}", results.size(), request.getContent(), username);

        } catch (RuntimeException e) {
            log.error("Error searching messages: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error searching messages: " + e.getMessage());
        }
    }

    @MessageMapping("/message.get")
    @Operation(summary = "Get message by ID", description = "Retrieves a single message by its ID")
    @ApiResponse(responseCode = "200", description = "Message retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleGetMessage(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getId() == null) {
                log.warn("Get message request without messageId from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "MessageId (id) is required");
                return;
            }

            MessageResponseDTO message = messageService.getMessageById(request.getId());
            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/message", message);
            log.info("Sent message {} to user {}", request.getId(), username);

        } catch (RuntimeException e) {
            log.error("Error retrieving message: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error retrieving message: " + e.getMessage());
        }
    }

    @MessageMapping("/message.read.bulk")
    @Operation(summary = "Bulk read receipts", description = "Marks multiple messages as read at once")
    @ApiResponse(responseCode = "200", description = "Bulk read receipts processed successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleBulkReadReceipts(ReadReceiptDTO dto, Principal principal) {
        try {
            if (dto == null || dto.getChannelId() == null || dto.getUserId() == null) {
                log.warn("Invalid bulk read receipt request from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "ChannelId and UserId are required");
                return;
            }

            // Broadcast bulk read receipt (messageId can be null for "read all in channel")
            if (dto.getReadAt() == null) {
                dto.setReadAt(System.currentTimeMillis());
            }
            
            // Broadcast to channel
            simpMessagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
            log.info("Bulk read receipt broadcast for channel {} by user {}", dto.getChannelId(), dto.getUserId());

        } catch (RuntimeException e) {
            log.error("Error processing bulk read receipt: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error processing bulk read receipt: " + e.getMessage());
        }
    }

    @MessageMapping("/mentions.list")
    @Operation(summary = "Get user mentions", description = "Retrieves all messages where the user was mentioned")
    @ApiResponse(responseCode = "200", description = "Mentions retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleGetMentions(MessageBaseDTO request, Principal principal) {
        try {
            if (request.getUserId() == null) {
                log.warn("Mentions request without userId from user: {}", principal != null ? principal.getName() : "Unknown");
                sendErrorToUser(principal, "UserId is required");
                return;
            }

            List<MessageResponseDTO> mentions = messageService.getMessagesWhereUserMentioned(request.getUserId());
            String username = principal != null ? principal.getName() : "Unknown";
            simpMessagingTemplate.convertAndSendToUser(username, "/queue/mentions", mentions);
            log.info("Sent {} mentions for user {} to user {}", mentions.size(), request.getUserId(), username);

        } catch (RuntimeException e) {
            log.error("Error retrieving mentions: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error retrieving mentions: " + e.getMessage());
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
