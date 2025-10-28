package com.devtalk.controller;


import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.service.ChannelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/channels")
@Tag(name = "Channels", description = "Channel management and retrieval operations")
public class ChannelController {

    private final ChannelService channelService;

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
}
