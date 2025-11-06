package com.devtalk.facades;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.dtos.channel.ChannelMessagesDTO;
import com.devtalk.dtos.messages.MessageResponseDTO;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.models.Channel;
import com.devtalk.services.ChannelService;
import com.devtalk.services.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Facade for coordinating operations between ChannelService and MessageService.
 * <p>
 * This class exists to resolve the circular dependency between MessageService and ChannelService
 * by acting as an intermediary for operations that require both services. It provides methods
 * that aggregate data from both services and maps them to appropriate DTOs for use by controllers
 * or other consumers.
 * <p>
 * Responsibilities:
 * <ul>
 *   <li>Retrieves channel information and associated messages in a single operation.</li>
 *   <li>Coordinates between ChannelService and MessageService to avoid direct circular dependencies.</li>
 *   <li>Maps combined data to response DTOs using ChannelMapper.</li>
 * </ul>
 */
public class ChannelMessageFacade {

    private final ChannelService channelService;
    private final MessageService messageService;
    private final ChannelMapper channelMapper;

    @Transactional(readOnly = true)
    public ChannelMessagesDTO getChannelWithMessages(Long channelId) {
        Channel channel = channelService.getChannelById(channelId);
        List<MessageResponseDTO> messages = messageService.getChannelMessagesOnly(channelId);
        return channelMapper.toResponseMessagesDTO(channel, messages);
    }
}
