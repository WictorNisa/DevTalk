package com.devtalk.controller;


import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.service.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService channelService;

    @GetMapping
    public ResponseEntity<List<ChannelResponseDTO>> getAllChannels() {
        List<ChannelResponseDTO> channels = channelService.getAllChannels();
        return ResponseEntity.ok(channels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChannelMessagesDTO> getChannelWithMessages(@PathVariable Long id) {
        ChannelMessagesDTO channelMessagesDTO = channelService.getChannelWithMessages(id);
        return ResponseEntity.ok(channelMessagesDTO);
    }
}
