package com.devtalk.controllers;


import com.devtalk.dtos.channel.ChannelMessagesDTO;
import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.dtos.channel.CreateChannelRequest;
import com.devtalk.dtos.messages.MessageResponseDTO;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/channels")
@Tag(name = "Channels", description = "Channel management and retrieval operations")
public class ChannelController {

    private final ChannelService channelService;
    private final MessageService messageService;

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
        ChannelMessagesDTO channelMessagesDTO = channelService.getChannelWithMessages(id);
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
