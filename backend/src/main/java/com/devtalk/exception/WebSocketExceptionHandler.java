package com.devtalk.exception;

import com.devtalk.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.security.Principal;

@ControllerAdvice
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketExceptionHandler {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatService chatService;

    @MessageExceptionHandler(ValidationException.class)
    public void handleValidationException(ValidationException exception, Message<?> message) {
        handleException(exception, message, "WebSocket validation error", null);
    }

    @MessageExceptionHandler(NotFoundException.class)
    public void handleNotFoundException(NotFoundException exception, Message<?> message) {
        handleException(exception, message, "WebSocket resource not found", "Resource not found: ");
    }

    @MessageExceptionHandler(ForbiddenException.class)
    public void handleForbiddenException(ForbiddenException exception, Message<?> message) {
        handleException(exception, message, "WebSocket forbidden", "Forbidden: ");
    }

    @MessageExceptionHandler(UnauthorizedException.class)
    public void handleUnauthorizedException(UnauthorizedException exception, Message<?> message) {
        handleException(exception, message, "WebSocket unauthorized", "Unauthorized: ");
    }

    @MessageExceptionHandler(NoGroupsFoundException.class)
    public void handleNoGroupsFoundException(NoGroupsFoundException exception, Message<?> message) {
        handleException(exception, message, "WebSocket no groups found", "No groups found: ");
    }

    @MessageExceptionHandler(RuntimeException.class)
    public void handleRuntimeException(RuntimeException exception, Message<?> message) {
        log.error("WebSocket unexpected error: {}", exception.getMessage(), exception);
        handleException(exception, message, "WebSocket unexpected error", "Error: ");
    }

    @MessageExceptionHandler(Throwable.class)
    public void handleGenericException(Throwable exception, Message<?> message) {
        log.error("WebSocket application error: {}", exception.getMessage(), exception);
        handleException(exception, message, "WebSocket application error", "Unexpected error: ");
    }

    private void handleException(Throwable exception, Message<?> message, String logPrefix, String errorPrefix) {
        if (logPrefix != null && !logPrefix.contains("unexpected") && !logPrefix.contains("application")) {
            log.warn("{}: {}", logPrefix, exception.getMessage());
        }
        Principal principal = getPrincipal(message);
        String errorMessage = errorPrefix != null 
            ? errorPrefix + exception.getMessage() 
            : exception.getMessage();
        
        if (principal != null) {
            chatService.sendErrorToUser(principal, errorMessage);
        } else {
            simpMessagingTemplate.convertAndSend("/topic/errors", errorMessage);
        }
    }

    private Principal getPrincipal(Message<?> message) {
        if (message == null) {
            return null;
        }
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(message);
        return accessor.getUser();
    }
}
