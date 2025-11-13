package com.devtalk.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageDeliveryService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToChannel(String destination, Object payload) {
        messagingTemplate.convertAndSend(destination, payload);
        log.debug("Sent message to channel destination: {}", destination);
    }

    public void sendToUserSessions(String username, String destination, Object payload) {
        if (username == null || username.isEmpty()) {
            log.warn("Cannot send to user sessions: username is null or empty");
            return;
        }

        messagingTemplate.convertAndSendToUser(username, destination, payload);
        log.debug("Sent message to user {} at destination {}", username, destination);
    }
}

