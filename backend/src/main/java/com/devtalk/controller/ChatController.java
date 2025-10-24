package com.devtalk.controller;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.messages.PingPongMessageDTO;
import com.devtalk.dto.user.UserResponseDTO;
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

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;
    private final UserService userService;
    private final ChannelService channelService;
    private final MessageMapper messageMapper;

    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    public PingPongMessageDTO handlePing(MessageBaseDTO pingMessage, Principal principal) {
        String user = principal != null ? principal.getName() : "Unknown";
        return PingPongMessageDTO.builder()
                .userId(pingMessage.getUserId())
                .channelId(pingMessage.getChannelId())
                .threadId(pingMessage.getThreadId())
                .type("PONG")
                .timestamp(System.currentTimeMillis())
                .build();
    }

    @MessageMapping("/chat.send")
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

        } catch (RuntimeException e) {
            log.error("Error handling chat message: {}", e.getMessage(), e);
            sendErrorToUser(principal, "Error sending message: " + e.getMessage());
        }
    }

    @MessageMapping("/message.history")
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

    private void sendErrorToUser(Principal principal, String errorMessage) {
        String username = principal != null ? principal.getName() : "Unknown";
        simpMessagingTemplate.convertAndSendToUser(username, "/queue/errors", errorMessage);
    }
}
