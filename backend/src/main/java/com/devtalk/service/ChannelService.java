package com.devtalk.service;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.model.Channel;
import com.devtalk.repository.ChannelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMapper channelMapper;
    private final MessageMapper messageMapper;

    @Transactional(readOnly = true)
    public List<ChannelResponseDTO> getAllChannels() {
        return channelRepository.findAll().stream()
                .map(channelMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    //Internal use
    @Transactional(readOnly = true)
    public Channel getChannelById(Long channelId) {
        return channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found with id: " + channelId));
    }

    @Transactional(readOnly = true)
    public ChannelResponseDTO getChannelDTOById(Long channelId) {
        Channel channel = getChannelById(channelId);
        return channelMapper.toResponseDTO(channel);
    }

    @Transactional(readOnly = true)
    public List<ChannelResponseDTO> getChannelsByGroupId(Long groupId) {
        return channelRepository.findByGroupIdWithGroup(groupId).stream()
                .map(channelMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChannelMessagesDTO getChannelWithMessages(Long channelId) {
        Optional<Channel> channelOpt = channelRepository.findById(channelId);
        if (channelOpt.isEmpty()) {
            throw new RuntimeException("Channel not found with id: " + channelId);
        }
        Channel channel = channelOpt.get();
        ChannelMessagesDTO channelMessagesDTO = new ChannelMessagesDTO();
        if(channel.getMessages() != null) {
            List<MessageResponseDTO> messageDTOs = channel.getMessages().stream()
                    .map(messageMapper::toResponseDTO)
                    .toList();
        }
        return channelMessagesDTO;
    }

}
