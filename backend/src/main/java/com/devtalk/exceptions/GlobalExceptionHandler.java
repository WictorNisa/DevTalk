package com.devtalk.exceptions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Void> handleUnauthorizedException(UnauthorizedException e) {
        log.warn("Unauthorized access attempt: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Void> handleNotFoundException(NotFoundException e) {
        log.warn("Resource not found: {}", e.getMessage());
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Void> handleForbiddenException(ForbiddenException e) {
        log.warn("Forbidden: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @ExceptionHandler(NoGroupsFoundException.class)
    public ResponseEntity<Void> handleNoGroupsFoundException(NoGroupsFoundException e) {
        log.warn("No groups found: {}", e.getMessage());
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Void> handleValidationException(ValidationException e) {
        log.warn("Validation error: {}", e.getMessage());
        return ResponseEntity.badRequest().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Void> handleRuntimeException(RuntimeException e) {
        log.error("Unexpected error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

