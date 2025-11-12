package com.devtalk.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devtalk.dtos.channel.ChannelMessagesDTO;
import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.dtos.channel.CreateChannelRequest;
import com.devtalk.dtos.messages.MessageResponseDTO;
import com.devtalk.dtos.messages.MessagesWithMetadataDTO;
import com.devtalk.facades.ChannelMessageFacade;
import com.devtalk.services.AuthService;
import com.devtalk.services.ChannelService;
import com.devtalk.services.MessageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/channels")
@Tag(name = "Channels", description = "Channel management and retrieval operations")
public class ChannelController {

    private final ChannelService channelService;
    private final MessageService messageService;
    private final ChannelMessageFacade channelMessageFacade;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get all channels", description = "Retrieves a list of all available channels")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all channels"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<ChannelResponseDTO>> getAllChannels() {
        List<ChannelResponseDTO> channels = channelService.getAllChannels();
        return ResponseEntity.ok(channels);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get channel with messages", description = "Retrieves a specific channel along with its messages")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved channel with messages"),
        @ApiResponse(responseCode = "404", description = "Channel not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ChannelMessagesDTO> getChannelWithMessages(
            @Parameter(description = "Channel ID", required = true, example = "1")
            @PathVariable Long id) {
        ChannelMessagesDTO channelMessagesDTO = channelMessageFacade.getChannelWithMessages(id);
        return ResponseEntity.ok(channelMessagesDTO);
    }

    @GetMapping("/{id}/messages")
    @Operation(summary = "Get channel messages", description = "Retrieves all messages for a specific channel")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved channel messages"),
        @ApiResponse(responseCode = "404", description = "Channel not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<MessageResponseDTO>> getChannelMessages(
            @Parameter(description = "Channel ID", required = true, example = "1")
            @PathVariable Long id) {
        List<MessageResponseDTO> messages = messageService.getChannelMessagesOnly(id);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{id}/messages/paginated")
    @Operation(summary = "Get channel messages with pagination", description = "Retrieves paginated messages for a specific channel with metadata")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved channel messages"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required"),
        @ApiResponse(responseCode = "403", description = "Forbidden - user does not have access to channel"),
        @ApiResponse(responseCode = "404", description = "Channel not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<MessagesWithMetadataDTO> getChannelMessagesPaginated(
            @Parameter(description = "Channel ID", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Maximum number of messages to return", example = "50")
            @RequestParam(required = false, defaultValue = "50") int limit,
            @Parameter(description = "Timestamp in milliseconds to fetch messages before this time")
            @RequestParam(required = false) Long before,
            @Parameter(description = "Sort order: 'asc' for ascending, 'desc' for descending (default: desc)", example = "desc")
            @RequestParam(required = false, defaultValue = "desc") String sort,
            @AuthenticationPrincipal OAuth2User oauth2User) {
        var user = authService.getAuthenticatedUser(oauth2User);
        MessagesWithMetadataDTO result = messageService.getChannelMessagesWithPagination(id, limit, before, user.getId(), sort);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    @Operation(summary = "Create new channel", description = "Creates a new channel in the specified group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Channel created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "404", description = "Group not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ChannelResponseDTO> createChannel(
            @Valid @RequestBody CreateChannelRequest request) {
        ChannelResponseDTO channel = channelService.createChannel(request.getName(), request.getGroupId());
        return ResponseEntity.status(HttpStatus.CREATED).body(channel);
    }
}
