package com.devtalk.service;

import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.AttachmentDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.enums.MessageReactionType;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.mappers.UserMapper;
import com.devtalk.model.Attachment;
import com.devtalk.model.Message;
import com.devtalk.model.MessageReaction;
import com.devtalk.model.User;
import com.devtalk.model.Thread;
import com.devtalk.repository.AttachmentRepository;
import com.devtalk.repository.MessageReactionRepository;
import com.devtalk.repository.MessageRepository;
import com.devtalk.repository.ThreadRepository;
import com.devtalk.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;


    @Transactional
    public MessageResponseDTO saveMessage(ChatMessageDTO dto, UserResponseDTO user, ChannelResponseDTO channel) {
        Message message = messageMapper.toEntity(dto);
        message.setUser(userMapper.toEntity(user));
        message.setChannel(channelMapper.toEntity(channel));
        
        // Handle threading: if parentMessageId exists, create or find thread
        if (dto.getParentMessageId() != null) {
            Message parentMessage = messageRepository.findById(dto.getParentMessageId())
                    .orElseThrow(() -> new RuntimeException("Parent message not found: " + dto.getParentMessageId()));
            message.setParentMessage(parentMessage);
            
            // Find or create thread for this parent message
            Thread thread = threadRepository.findByOriginalMessageId(dto.getParentMessageId())
                    .orElseGet(() -> {
                        // Create new thread if it doesn't exist
                        Thread newThread = Thread.builder()
                                .channel(channelMapper.toEntity(channel))
                                .originalMessage(parentMessage)
                                .build();
                        return threadRepository.save(newThread);
                    });
            message.setThread(thread);
        } else if (dto.getThreadId() != null) {
            // Message is a reply to an existing thread
            Thread thread = threadRepository.findById(dto.getThreadId())
                    .orElseThrow(() -> new RuntimeException("Thread not found: " + dto.getThreadId()));
            message.setThread(thread);
            // Set parent message to thread's original message if not explicitly set
            if (message.getParentMessage() == null) {
                message.setParentMessage(thread.getOriginalMessage());
            }
        }
        
        Message saved = messageRepository.save(message);
        log.info("Saved message {} from user {} to channel {}", saved.getId(), user.getId(), channel.getId());
        
        // Fetch with all details including attachments and reactions
        Message messageWithDetails = messageRepository.findByIdWithAllDetails(saved.getId())
                .orElse(saved);
        MessageResponseDTO response = messageMapper.toResponseDTO(messageWithDetails);
        
        // Set reply count
        Long replyCount = messageRepository.countRepliesByMessageId(saved.getId());
        response.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
        
        return response;
    }

    // TODO: Return value is never used.
    @Transactional
    public MessageReaction addReaction(Long messageId, Long userId, MessageReactionType type) {
        var existing = messageReactionRepository.findByMessage_IdAndUser_IdAndReactionType(messageId, userId, type);
        if (existing.isPresent()) {
            return existing.get();
        }

        User user = userRepository.getReferenceById(userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));

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
                .map(message -> {
                    // Fetch with all details for search results
                    Message messageWithDetails = messageRepository.findByIdWithAllDetails(message.getId())
                            .orElse(message);
                    MessageResponseDTO dto = messageMapper.toResponseDTO(messageWithDetails);
                    
                    // Set reply count
                    Long replyCount = messageRepository.countRepliesByMessageId(message.getId());
                    dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessages(Long channelId, int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Message> messages = messageRepository.findLatestByChannel(channelId, pageRequest).getContent();

        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .peek(dto -> {
                    if (dto.getId() != null) {
                        Long replyCount = messageRepository.countRepliesByMessageId(dto.getId());
                        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    }
                })
                .collect(Collectors.toList());

        Collections.reverse(result);
        return result;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getAllChannelMessages(Long channelId) {
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);

        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .peek(dto -> {
                    if (dto.getId() != null) {
                        Long replyCount = messageRepository.countRepliesByMessageId(dto.getId());
                        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    }
                })
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
                .peek(dto -> {
                    if (dto.getId() != null) {
                        Long replyCount = messageRepository.countRepliesByMessageId(dto.getId());
                        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    }
                })
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
        Message message = messageRepository.findByIdWithAllDetails(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        MessageResponseDTO dto = messageMapper.toResponseDTO(message);
        
        // Set reply count
        Long replyCount = messageRepository.countRepliesByMessageId(messageId);
        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
        
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadReplies(Long parentMessageId) {
        List<Message> replies = messageRepository.findByParentMessageId(parentMessageId);
        return replies.stream()
                .map(messageMapper::toResponseDTO)
                .peek(dto -> {
                    // Set reply count for each reply
                    if (dto.getId() != null) {
                        Long replyCount = messageRepository.countRepliesByMessageId(dto.getId());
                        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadMessages(Long threadId) {
        List<Message> messages = messageRepository.findByThreadId(threadId);
        return messages.stream()
                .map(messageMapper::toResponseDTO)
                .peek(dto -> {
                    // Set reply count for each message
                    if (dto.getId() != null) {
                        Long replyCount = messageRepository.countRepliesByMessageId(dto.getId());
                        dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelThreads(Long channelId) {
        List<Thread> threads = threadRepository.findByChannelId(channelId);
        return threads.stream()
                .map(Thread::getOriginalMessage)
                .map(message -> {
                    Message messageWithDetails = messageRepository.findByIdWithAllDetails(message.getId())
                            .orElse(message);
                    MessageResponseDTO dto = messageMapper.toResponseDTO(messageWithDetails);
                    // Set reply count
                    Long replyCount = messageRepository.countRepliesByMessageId(message.getId());
                    dto.setReplyCount(replyCount != null ? replyCount.intValue() : 0);
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
