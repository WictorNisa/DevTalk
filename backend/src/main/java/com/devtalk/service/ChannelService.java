package com.devtalk.service;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.MessagesWithMetadataDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.model.Channel;
import com.devtalk.model.Group;
import com.devtalk.model.Message;
import com.devtalk.repository.ChannelRepository;
import com.devtalk.repository.GroupRepository;
import com.devtalk.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
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
    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;

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
            channelMessagesDTO.setMessages(messageDTOs);
        }
        return channelMessagesDTO;
    }

    @Transactional(readOnly = true)
    public MessagesWithMetadataDTO getChannelMessagesWithPagination(Long channelId, int limit, Long before) {
        if (!channelRepository.existsById(channelId)) {
            throw new RuntimeException("Channel not found with id: " + channelId);
        }

        PageRequest pageRequest = PageRequest.of(0, limit + 1, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Message> messagePage;

        if (before != null) {
            Instant beforeInstant = Instant.ofEpochMilli(before);
            messagePage = messageRepository.findByChannelIdAndCreatedAtBefore(channelId, beforeInstant, pageRequest);
        } else {
            messagePage = messageRepository.findLatestByChannel(channelId, pageRequest);
        }

        List<Message> messages = messagePage.getContent();
        boolean hasMore = messages.size() > limit;


        if (hasMore) {
            messages = messages.subList(0, limit);
        }

        List<MessageResponseDTO> messageDTOs = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
        Collections.reverse(messageDTOs);

        return MessagesWithMetadataDTO.builder()
                .messages(messageDTOs)
                .hasMore(hasMore)
                .build();
    }

    @Transactional
    public ChannelResponseDTO createChannel(String name, Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        Channel channel = Channel.builder()
                .name(name)
                .group(group)
                .build();

        Channel saved = channelRepository.save(channel);
        log.info("Created channel {} in group {}", name, groupId);
        return channelMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesOnly(Long channelId) {
        if (!channelRepository.existsById(channelId)) {
            throw new RuntimeException("Channel not found with id: " + channelId);
        }
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);
        return messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }
}
