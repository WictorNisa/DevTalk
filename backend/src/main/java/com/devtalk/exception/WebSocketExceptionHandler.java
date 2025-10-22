package com.devtalk.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketExceptionHandler {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageExceptionHandler(Throwable.class)
    public void handleMessageException(Throwable exception, Message<?> message){
        log.warn("WebSocket Application Error: {}", exception.getMessage(), exception);
        Map<String, Object> payload = new HashMap<>();
        payload.put("error", exception.getMessage());
        simpMessagingTemplate.convertAndSend("/topic/errors", payload);
    }
}
