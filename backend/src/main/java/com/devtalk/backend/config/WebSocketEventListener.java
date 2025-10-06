package com.devtalk.backend.config;

import com.devtalk.backend.model.ChatMessage;
import com.devtalk.backend.model.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    // Broadcasts to all users that a user has disconnected
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = headerAccessor.getSessionAttributes().get("username").toString();
        if(username != null){
            log.info("User Disconnected : {}", username);
            ChatMessage chatMessage = ChatMessage.builder().messageType(MessageType.LEAVE).build();
            messageTemplate.convertAndSend("/topic/leave", chatMessage);
        }
    }
}
