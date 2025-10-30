package com.devtalk.service;

import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.AttachmentDTO;
import com.devtalk.enums.MessageReactionType;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.mappers.UserMapper;
import com.devtalk.model.Message;
import com.devtalk.model.Attachment;
import com.devtalk.model.MessageReaction;
import com.devtalk.model.User;
import com.devtalk.repository.MessageRepository;
import com.devtalk.repository.MessageReactionRepository;
import com.devtalk.repository.AttachmentRepository;
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
    private final MessageReactionRepository messageReactionRepository;
    private final AttachmentRepository attachmentRepository;


    @Transactional
    public MessageResponseDTO saveMessage(ChatMessageDTO dto, UserResponseDTO user, ChannelResponseDTO channel) {
        Message message = messageMapper.toEntity(dto);
        message.setUser(userMapper.toEntity(user));
        message.setChannel(channelMapper.toEntity(channel));
        if (dto.getParentMessageId() != null) {
            message.setParentMessage(messageRepository.findById(dto.getParentMessageId())
                    .orElseThrow(() -> new RuntimeException("Parent message not found: " + dto.getParentMessageId())));
        }
        Message saved = messageRepository.save(message);
        log.info("Saved message {} from user {} to channel {}", saved.getId(), user.getId(), channel.getId());
        return messageMapper.toResponseDTO(saved);
    }
    @Transactional
    public MessageReaction addReaction(Long messageId, Long userId, MessageReactionType type) {
        var existing = messageReactionRepository.findByMessage_IdAndUser_IdAndReactionType(messageId, userId, type);
        if (existing.isPresent()) { return existing.get(); }
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        User user = userMapper.toEntity(userMapper.toDTO(message.getUser())); // ensure managed user if needed
        MessageReaction reaction = MessageReaction.builder()
                .message(message)
                .user(user)
                .reactionType(type)
                .build();
        return messageReactionRepository.save(reaction);
    }

    @Transactional
    public void removeReaction(Long messageId, Long userId, MessageReactionType type) {
        messageReactionRepository.findByMessage_IdAndUser_IdAndReactionType(messageId, userId, type)
                .ifPresent(messageReactionRepository::delete);
    }

    @Transactional
    public MessageResponseDTO addAttachment(AttachmentDTO dto) {
        Message message = messageRepository.findById(dto.getMessageId())
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + dto.getMessageId()));
        Attachment attachment = Attachment.builder()
                .message(message)
                .type(dto.getType())
                .url(dto.getUrl())
                .filename(dto.getFilename())
                .sizeBytes(dto.getSizeBytes())
                .build();
        attachmentRepository.save(attachment);
        return messageMapper.toResponseDTO(messageRepository.findByIdWithAllDetails(message.getId())
                .orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> searchMessages(String query, int limit) {
        return messageRepository.findByContentContainingIgnoreCase(query).stream()
                .limit(limit)
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
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

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesBefore(Long channelId, long beforeEpochMillis, int pageSize) {
        PageRequest pageRequest = PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Message> messages = messageRepository
                .findByChannelIdAndCreatedAtBefore(channelId, Instant.ofEpochMilli(beforeEpochMillis), pageRequest)
                .getContent();

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
