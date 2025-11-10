package com.devtalk.configs;

import com.devtalk.dtos.user.UserStatusMessageDTO;
import com.devtalk.enums.ConnectionType;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.services.PresenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final PresenceService presenceService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String username = "Unknown";
        var user = headerAccessor.getUser();
        if (user != null) {
            username = user.getName();
        }
        presenceService.registerSession(sessionId, username);
        log.info("WebSocket connected. Session ID: {}, user: {}", sessionId, username);

        UserStatusMessageDTO message = UserStatusMessageDTO.of(
                ConnectionType.JOIN,
                sessionId,
                null,
                username,
                PresenceStatus.ONLINE);

        simpMessagingTemplate.convertAndSend("/topic/users", message);
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String destination = headerAccessor.getDestination();
        String username = "Unknown";
        var user = headerAccessor.getUser();
        if (user != null) {
            username = user.getName();
        }
        if(destination != null){
            presenceService.addSubscription(sessionId, destination);
            log.info("Session {} subscribed to {}", sessionId, destination);

            UserStatusMessageDTO message = UserStatusMessageDTO.of(ConnectionType.SUBSCRIBE,
                    sessionId,
                    destination,
                    username,
                    PresenceStatus.ONLINE);

            simpMessagingTemplate.convertAndSend("/topic/users", message);
        }

    }
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String username = presenceService.getUsername(sessionId);

        Set<String> subscribedDestinations = presenceService.removeSession(sessionId);

        log.info("WebSocket disconnected. Session ID: {}, user: {}", sessionId, username);

        UserStatusMessageDTO leaveMsg = UserStatusMessageDTO.of(
                ConnectionType.LEAVE,
                sessionId,
                null,
                username,
                PresenceStatus.OFFLINE
        );

        simpMessagingTemplate.convertAndSend("/topic/users", leaveMsg);

        for (String dest : subscribedDestinations) {
            UserStatusMessageDTO roomLeave = UserStatusMessageDTO.of(
                    ConnectionType.LEAVE,
                    sessionId,
                    dest,
                    username,
                    PresenceStatus.OFFLINE
            );
            try {
                simpMessagingTemplate.convertAndSend(dest, roomLeave);
            } catch (Exception ex) {
                log.warn("Failed to notify destination {} for session {}: {}", dest, sessionId, ex.getMessage());
            }
        }
    }
}
