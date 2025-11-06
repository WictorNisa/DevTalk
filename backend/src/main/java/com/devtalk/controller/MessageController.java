package com.devtalk.controller;

import com.devtalk.dto.messages.CreateMessageRequest;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.service.AuthService;
import com.devtalk.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Messages", description = "Message management and retrieval operations")
public class MessageController {

    private final MessageService messageService;
    private final AuthService authService;

    @GetMapping("/{id}")
    @Operation(summary = "Get message by ID", description = "Retrieves a specific message by its unique identifier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved message"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
        @ApiResponse(responseCode = "404", description = "Message not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<MessageResponseDTO> getMessageById(
            @Parameter(description = "Message ID", required = true, example = "1")
            @PathVariable Long id) {
        MessageResponseDTO message = messageService.getMessageById(id);
        return ResponseEntity.ok(message);
    }

    @PostMapping
    @Operation(summary = "Create new message", description = "Creates a new message in the specified channel")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Message created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
        @ApiResponse(responseCode = "404", description = "Channel or user not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<MessageResponseDTO> createMessage(
            @Valid @RequestBody CreateMessageRequest request,
            @AuthenticationPrincipal OAuth2User oauth2User) {
        var user = authService.getAuthenticatedUser(oauth2User);
        MessageResponseDTO savedMessage = messageService.createMessage(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete message", description = "Deletes a message. Only the message sender can delete their own messages")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Message deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
        @ApiResponse(responseCode = "403", description = "Forbidden - user not authorized to delete this message"),
        @ApiResponse(responseCode = "404", description = "Message not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteMessage(
            @Parameter(description = "Message ID", required = true, example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauth2User) {
        var user = authService.getAuthenticatedUser(oauth2User);
        messageService.deleteMessage(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}

