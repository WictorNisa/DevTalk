package com.devtalk.controller;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.PingPongMessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.PingMessage;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

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
        if(message == null || message.getDestination() == null) return;
        message.setSender(principal != null ? principal.getName() : "Unknown");
        simpMessagingTemplate.convertAndSend(message.getDestination(), message);
    }
}
