package com.devtalk.service;

import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.mappers.UserMapper;
import com.devtalk.model.Channel;
import com.devtalk.model.Message;
import com.devtalk.model.User;
import com.devtalk.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final UserMapper userMapper;
    private final ChannelMapper channelMapper;


    @Transactional
    public MessageResponseDTO saveMessage(ChatMessageDTO dto, UserResponseDTO user, ChannelResponseDTO channel) {
        Message message = messageMapper.toEntity(dto);
        message.setUser(userMapper.toEntity(user));
        message.setChannel(channelMapper.toEntity(channel));
        Message saved = messageRepository.save(message);
        log.info("Saved message {} from user {} to channel {}", saved.getId(), user.getId(), channel.getId());
        return messageMapper.toResponseDTO(saved);
    }


    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessages(Long channelId, int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Message> messages = messageRepository.findLatestByChannel(channelId, pageRequest).getContent();

        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());

        Collections.reverse(result);
        return result;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getAllChannelMessages(Long channelId) {
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);

        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());

        Collections.reverse(result);
        return result;
    }


    @Transactional
    public Message editMessage(Long messageId, String newContent, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));

        if (!message.getUser().getId().equals(userId)) {
            throw new RuntimeException("User not authorized to edit this message");
        }

        message.setContent(newContent);
        message.setEditedAt(Instant.now());
        Message updated = messageRepository.save(message);
        log.info("Edited message {}", messageId);
        return updated;
    }


    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));

        if (!message.getUser().getId().equals(userId)) {
            throw new RuntimeException("User not authorized to delete this message");
        }

        messageRepository.delete(message);
        log.info("Deleted message {}", messageId);
    }

    @Transactional(readOnly = true)
    public MessageResponseDTO getMessageById(Long messageId) {
        Message message = messageRepository.findByIdWithAuthorAndChannel(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        return messageMapper.toResponseDTO(message);
    }
}
