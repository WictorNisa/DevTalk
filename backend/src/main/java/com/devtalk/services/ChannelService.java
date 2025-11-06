package com.devtalk.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.models.Channel;
import com.devtalk.models.Group;
import com.devtalk.repositories.ChannelRepository;
import com.devtalk.repositories.GroupRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMapper channelMapper;
    private final GroupRepository groupRepository;

    // Removed @Lazy MessageService dependency!
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

    // Moved getChannelWithMessages(), it now lives in ChannelMessageFacade. 
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
