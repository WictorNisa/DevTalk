package com.devtalk.service;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.exception.NotFoundException;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.model.Channel;
import com.devtalk.model.Group;
import com.devtalk.repository.ChannelRepository;
import com.devtalk.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMapper channelMapper;
    private final GroupRepository groupRepository;
    @Lazy
    private final MessageService messageService;

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
                .orElseThrow(() -> new NotFoundException("Channel not found with id: " + channelId));
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
        Channel channel = getChannelById(channelId);
        List<MessageResponseDTO> messages = messageService.getChannelMessagesOnly(channelId);
        return channelMapper.toResponseMessagesDTO(channel, messages);
    }

    @Transactional
    public ChannelResponseDTO createChannel(String name, Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Group not found with id: " + groupId));

        Channel channel = Channel.builder()
                .name(name)
                .group(group)
                .build();

        Channel saved = channelRepository.save(channel);
        log.info("Created channel {} in group {}", name, groupId);
        return channelMapper.toResponseDTO(saved);
    }

}
