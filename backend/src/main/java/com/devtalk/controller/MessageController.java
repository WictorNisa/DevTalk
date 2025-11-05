package com.devtalk.controller;

import com.devtalk.dto.messages.CreateMessageRequest;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.service.ChannelService;
import com.devtalk.service.MessageService;
import com.devtalk.service.UserService;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.user.UserResponseDTO;
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
    private final UserService userService;
    private final ChannelService channelService;

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
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            // Authentication check
            if (oauth2User == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            MessageResponseDTO message = messageService.getMessageById(id);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            log.error("Error retrieving message {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
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
        try {
            // Authentication check
            if (oauth2User == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Get or create user from OAuth2 principal
            String externalId = oauth2User.getAttribute("login"); // GitHub login
            if (externalId == null) {
                externalId = oauth2User.getName();
            }
            String displayName = oauth2User.getAttribute("name");
            if (displayName == null) {
                displayName = externalId;
            }
            UserResponseDTO user = userService.createOrGetUser(externalId, displayName);
            ChannelResponseDTO channel = channelService.getChannelDTOById(request.getChannelId());

            ChatMessageDTO chatMessageDTO = ChatMessageDTO.builder()
                    .channelId(request.getChannelId())
                    .content(request.getContent())
                    .userId(user.getId())
                    .parentMessageId(request.getParentMessageId())
                    .threadId(request.getThreadId())
                    .build();

            MessageResponseDTO savedMessage = messageService.saveMessage(chatMessageDTO, user, channel);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
        } catch (RuntimeException e) {
            log.error("Error creating message: {}", e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
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
        try {
            // Authentication check
            if (oauth2User == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Get or create user from OAuth2 principal
            String externalId = oauth2User.getAttribute("login"); // GitHub login
            if (externalId == null) {
                externalId = oauth2User.getName();
            }
            String displayName = oauth2User.getAttribute("name");
            if (displayName == null) {
                displayName = externalId;
            }
            UserResponseDTO user = userService.createOrGetUser(externalId, displayName);
            
            messageService.deleteMessage(id, user.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting message {}: {}", id, e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            if (e.getMessage().contains("not authorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

