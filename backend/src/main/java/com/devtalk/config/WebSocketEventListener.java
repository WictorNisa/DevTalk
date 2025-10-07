package com.devtalk.config;

import com.devtalk.model.ChatMessage;
import com.devtalk.model.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
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
        Object usernameObj = headerAccessor.getSessionAttributes().get("username");
        if (usernameObj != null) {
            String username = usernameObj.toString();
            log.info("User Disconnected : {}", username);
            ChatMessage chatMessage = ChatMessage.builder().messageType(MessageType.LEAVE).messageAuthor(username).build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
