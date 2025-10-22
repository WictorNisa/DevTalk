package com.devtalk.service;

import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.mappers.ChannelMapper;
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

    @Transactional(readOnly = true)
    public Channel getChannelById(Long channelId) {
        return channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found with id: " + channelId));
    }

    @Transactional(readOnly = true)
    public ChannelResponseDTO getChannelDTOById(Long channelId) {
        Channel channel = getChannelById(channelId);
        return channelMapper.toDTO(channel);
    }

    @Transactional(readOnly = true)
    public Optional<Channel> findChannelById(Long channelId) {
        return channelRepository.findById(channelId);
    }

    @Transactional(readOnly = true)
    public List<ChannelResponseDTO> getChannelsByGroupId(Long groupId) {
        return channelRepository.findByGroupIdWithGroup(groupId).stream()
                .map(channelMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Channel getChannelWithMessages(Long channelId) {
        return channelRepository.findByIdWithMessages(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found with id: " + channelId));
    }

    @Transactional(readOnly = true)
    public List<ChannelResponseDTO> getAllChannels() {
        return channelRepository.findAll().stream()
                .map(channelMapper::toDTO)
                .collect(Collectors.toList());
    }
}
