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
