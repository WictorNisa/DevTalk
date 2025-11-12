package com.devtalk.exceptions;

import java.time.Instant;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.devtalk.dtos.messages.ErrorResponseDTO;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnauthorizedException(UnauthorizedException e) {
        log.warn("Unauthorized access attempt: {}", e.getMessage());
        return buildErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFoundException(NotFoundException e) {
        log.warn("Resource not found: {}", e.getMessage());
        return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponseDTO> handleForbiddenException(ForbiddenException e) {
        log.warn("Forbidden: {}", e.getMessage());
        return buildErrorResponse(e.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NoGroupsFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoGroupsFoundException(NoGroupsFoundException e) {
        log.warn("No groups found: {}", e.getMessage());
        return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationException(ValidationException e) {
        log.warn("Validation error: {}", e.getMessage());
        return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDTO> handleRuntimeException(RuntimeException e) {
        log.error("Unexpected error: {}", e.getMessage(), e);
        return buildErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponseDTO> buildErrorResponse(String message, HttpStatus status) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .message(message)
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.status(status).body(error);
    }
}

