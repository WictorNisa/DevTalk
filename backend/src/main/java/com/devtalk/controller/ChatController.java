package com.devtalk.controller;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.messages.PingPongMessageDTO;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.model.Channel;
import com.devtalk.model.Message;
import com.devtalk.model.User;
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
    private final MessageMapper messageMapper;

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
            User user = userService.getUserById(message.getUserId());

            if (message.getChannelId() == null) {
                log.warn("Message received without channelId");
                sendErrorToUser(principal, "ChannelId is required");
                return;
            }
            Channel channel = channelService.getChannelById(message.getChannelId());
            Message savedMessage = messageService.saveMessage(message, user, channel);
            MessageResponseDTO response = messageMapper.toResponseDTO(savedMessage);
            simpMessagingTemplate.convertAndSend(message.getDestination(), response);
            log.info("Broadcasted message {} from user {} to {}", savedMessage.getId(), user.getDisplayName(), message.getDestination());

        } catch (RuntimeException e) {
            log.error("Error handling chat message: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error sending message: " + e.getMessage());
        }
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

            List<MessageResponseDTO> messages = messageService.getChannelMessages(request.getChannelId(), 50);

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
