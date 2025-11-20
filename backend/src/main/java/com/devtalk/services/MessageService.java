package com.devtalk.services;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.dtos.messages.AttachmentDTO;
import com.devtalk.dtos.messages.ChatMessageDTO;
import com.devtalk.dtos.messages.CreateMessageRequest;
import com.devtalk.dtos.messages.MessageResponseDTO;
import com.devtalk.dtos.messages.MessagesWithMetadataDTO;
import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.enums.MessageReactionType;
import com.devtalk.exceptions.ForbiddenException;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.mappers.UserMapper;
import com.devtalk.models.Message;
import com.devtalk.repositories.ChannelRepository;
import com.devtalk.repositories.MessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final UserMapper userMapper;
    private final ChannelMapper channelMapper;
    private final ChannelRepository channelRepository;
    private final MessageQueryService messageQueryService;
    private final MessageReactionService messageReactionService;
    private final MessageAttachmentService messageAttachmentService;
    private final MessageMentionService messageMentionService;
    private final MessageThreadService messageThreadService;

    @Transactional
    public MessageResponseDTO saveMessage(ChatMessageDTO dto, UserResponseDTO user, ChannelResponseDTO channel) {
        Message message = messageMapper.toEntity(dto, user, channel, userMapper, channelMapper);

        messageThreadService.handleThreading(message, dto, channel);

        Message saved = messageRepository.save(message);
        log.info("Saved message {} from user {} to channel {}", saved.getId(), user.getId(), channel.getId());

        messageMentionService.parseAndSaveMentions(saved, dto.getContent());

        // Fetch with all details including attachments, reactions, and mentions
        Message messageWithDetails = messageRepository.findByIdWithAllDetails(saved.getId())
                .orElse(saved);
        MessageResponseDTO response = messageMapper.toResponseDTO(messageWithDetails);

        Long replyCount = messageRepository.countRepliesByMessageId(saved.getId());
        response.setReplyCount(replyCount != null ? replyCount.intValue() : 0);

        return response;
    }

    @Transactional
    public void addReaction(Long messageId, Long userId, MessageReactionType type) {
        messageReactionService.addReaction(messageId, userId, type);
    }

    @Transactional
    public void removeReaction(Long messageId, Long userId, MessageReactionType type) {
        messageReactionService.removeReaction(messageId, userId, type);
    }

    @Transactional
    public MessageResponseDTO addAttachment(AttachmentDTO dto) {
        return messageAttachmentService.addAttachment(dto);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> searchMessages(String query, int limit) {
        return messageQueryService.searchMessages(query, limit);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessages(Long channelId, int limit) {
        return messageQueryService.getChannelMessages(channelId, limit);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getAllChannelMessages(Long channelId) {
        return messageQueryService.getAllChannelMessages(channelId);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesBefore(Long channelId, long beforeEpochMillis, int pageSize) {
        return messageQueryService.getChannelMessagesBefore(channelId, beforeEpochMillis, pageSize);
    }

    @Transactional
    public Message editMessage(Long messageId, String newContent, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + messageId));

        if (!message.getUser().getId().equals(userId)) {
            throw new ForbiddenException("User not authorized to edit this message");
        }

        message.setContent(newContent);
        message.setEditedAt(Instant.now());

        message.clearMentions();
        Message updated = messageRepository.save(message);
        messageMentionService.parseAndSaveMentions(updated, newContent);

        log.info("Edited message {}", messageId);
        return updated;
    }

    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + messageId));

        if (!message.getUser().getId().equals(userId)) {
            throw new ForbiddenException("User not authorized to delete this message");
        }

        messageRepository.delete(message);
        log.info("Deleted message {}", messageId);
    }

    @Transactional(readOnly = true)
    public MessageResponseDTO getMessageById(Long messageId) {
        return messageQueryService.getMessageById(messageId);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadReplies(Long parentMessageId) {
        return messageQueryService.getThreadReplies(parentMessageId);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadMessages(Long threadId) {
        return messageQueryService.getThreadMessages(threadId);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelThreads(Long channelId) {
        return messageQueryService.getChannelThreads(channelId);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getMessagesWhereUserMentioned(Long userId) {
        return messageQueryService.getMessagesWhereUserMentioned(userId);
    }

    @Transactional
    public MessageResponseDTO createMessage(CreateMessageRequest request, UserResponseDTO user) {
        var channel = channelRepository.findById(request.getChannelId())
                .orElseThrow(() -> new NotFoundException("Channel not found with id: " + request.getChannelId()));

        ChannelResponseDTO channelDTO = channelMapper.toResponseDTO(channel);
        ChatMessageDTO chatMessageDTO = messageMapper.toChatMessageDTO(request, user.getId());

        return saveMessage(chatMessageDTO, user, channelDTO);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesOnly(Long channelId) {
        return messageQueryService.getChannelMessagesOnly(channelId);
    }

    @Transactional(readOnly = true)
    public MessagesWithMetadataDTO getChannelMessagesWithPagination(Long channelId, int limit, Long before, Long userId, String sort) {
        return messageQueryService.getChannelMessagesWithPagination(channelId, limit, before, userId, sort);
    }

    @Transactional(readOnly = true)
    public List<Long> getMentionedUserIds(Long messageId) {
        return messageMentionService.getMentionedUserIds(messageId);
    }

    @Transactional(readOnly = true)
    public Long getUnreadMentionCount(Long userId, Long channelId) {
        return messageMentionService.getUnreadMentionCount(userId, channelId);
    }
}
