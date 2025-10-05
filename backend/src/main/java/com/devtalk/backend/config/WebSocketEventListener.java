package com.devtalk.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    // TODO - Inform the users in the room that a user has disconnected (or gone offline)
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        log.info("WebSocket connection closed");
    }
}
