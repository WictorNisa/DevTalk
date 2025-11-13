package com.devtalk.services;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.dtos.messages.MessageResponseDTO;
import com.devtalk.dtos.messages.MessagesWithMetadataDTO;
import com.devtalk.exceptions.ForbiddenException;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.models.Message;
import com.devtalk.models.MessageMention;
import com.devtalk.models.Thread;
import com.devtalk.repositories.ChannelRepository;
import com.devtalk.repositories.MessageMentionRepository;
import com.devtalk.repositories.MessageRepository;
import com.devtalk.repositories.ThreadRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageQueryService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final ChannelService channelService;
    private final ChannelRepository channelRepository;
    private final ThreadRepository threadRepository;
    private final MessageMentionRepository messageMentionRepository;

    @Transactional(readOnly = true)
    public MessageResponseDTO getMessageById(Long messageId) {
        Message message = messageRepository.findByIdWithAllDetails(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + messageId));
        MessageResponseDTO dto = messageMapper.toResponseDTO(message);
        setReplyCount(dto, messageId);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> searchMessages(String query, int limit) {
        List<Message> messages = messageRepository.findByContentContainingIgnoreCase(query).stream()
                .limit(limit)
                .map(message -> messageRepository.findByIdWithAllDetails(message.getId())
                        .orElse(message))
                .collect(Collectors.toList());

        return toMessageDTOs(messages);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessages(Long channelId, int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Message> messages = messageRepository.findLatestByChannel(channelId, pageRequest).getContent();
        return toMessageDTOs(messages, true);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getAllChannelMessages(Long channelId) {
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);
        return toMessageDTOs(messages, true);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesBefore(Long channelId, long beforeEpochMillis, int pageSize) {
        PageRequest pageRequest = PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Message> messages = messageRepository
                .findByChannelIdAndCreatedAtBefore(channelId, Instant.ofEpochMilli(beforeEpochMillis), pageRequest)
                .getContent();
        return toMessageDTOs(messages, true);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesOnly(Long channelId) {
        if(channelId == null){
            throw new NotFoundException("Id does not exist");
        }
        if (!channelRepository.existsById(channelId)) {
            throw new NotFoundException("Channel not found with id: " + channelId);
        }
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);
        return toMessageDTOs(messages);
    }

    @Transactional(readOnly = true)
    public MessagesWithMetadataDTO getChannelMessagesWithPagination(Long channelId, int limit, Long before, Long userId, String sort) {
        if (!channelService.hasUserAccessToChannel(userId, channelId)) {
            throw new ForbiddenException("User does not have access to channel with id: " + channelId);
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(0, limit + 1, Sort.by(direction, "createdAt"));
        org.springframework.data.domain.Page<Message> messagePage;

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

        boolean reverse = direction == Sort.Direction.DESC;
        List<MessageResponseDTO> messageDTOs = toMessageDTOs(messages, reverse);
        return messageMapper.toMessagesWithMetadataDTO(messageDTOs, hasMore);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadReplies(Long parentMessageId) {
        List<Message> replies = messageRepository.findByParentMessageId(parentMessageId);
        return toMessageDTOs(replies);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadMessages(Long threadId) {
        List<Message> messages = messageRepository.findByThreadId(threadId);
        return toMessageDTOs(messages);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelThreads(Long channelId) {
        List<Thread> threads = threadRepository.findByChannelId(channelId);
        List<Message> messages = threads.stream()
                .map(Thread::getOriginalMessage)
                .collect(Collectors.toList());
        return toMessageDTOs(messages);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getMessagesWhereUserMentioned(Long userId) {
        List<MessageMention> mentions = messageMentionRepository.findByMentionedUserId(userId);
        List<Message> messages = mentions.stream()
                .map(MessageMention::getMessage)
                .collect(Collectors.toList());
        List<MessageResponseDTO> result = toMessageDTOs(messages);
        result.sort((a, b) -> Long.compare(b.getTimestamp(), a.getTimestamp()));
        return result;
    }

    private void setReplyCount(MessageResponseDTO dto, Long messageId) {
        Long replyCount = messageRepository.countRepliesByMessageId(messageId);
        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
    }

    private void setReplyCountsBatch(List<MessageResponseDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return;
        }

        List<Long> messageIds = dtos.stream()
                .map(MessageResponseDTO::getId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        if (messageIds.isEmpty()) {
            return;
        }

        List<Object[]> replyCounts = messageRepository.findReplyCountsByMessageIds(messageIds);
        java.util.Map<Long, Long> replyCountMap = replyCounts.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

        dtos.forEach(dto -> {
            if (dto.getId() != null) {
                Long replyCount = replyCountMap.get(dto.getId());
                dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
            }
        });
    }

    private List<MessageResponseDTO> toMessageDTOs(List<Message> messages) {
        return toMessageDTOs(messages, false);
    }

    private List<MessageResponseDTO> toMessageDTOs(List<Message> messages, boolean reverse) {
        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());

        setReplyCountsBatch(result);

        if (reverse) {
            Collections.reverse(result);
        }

        return result;
    }
}

