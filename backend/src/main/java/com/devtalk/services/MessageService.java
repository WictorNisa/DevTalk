package com.devtalk.services;

import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.dtos.messages.AttachmentDTO;
import com.devtalk.dtos.messages.ChatMessageDTO;
import com.devtalk.dtos.messages.CreateMessageRequest;
import com.devtalk.dtos.messages.MessageResponseDTO;
import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.enums.MessageReactionType;
import com.devtalk.exceptions.ForbiddenException;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.mappers.UserMapper;
import com.devtalk.models.Attachment;
import com.devtalk.models.Message;
import com.devtalk.models.MessageMention;
import com.devtalk.models.MessageReaction;
import com.devtalk.models.User;
import com.devtalk.models.Thread;
import com.devtalk.dtos.messages.MessagesWithMetadataDTO;
import com.devtalk.repositories.AttachmentRepository;
import com.devtalk.repositories.ChannelRepository;
import com.devtalk.repositories.MessageMentionRepository;
import com.devtalk.repositories.MessageReactionRepository;
import com.devtalk.repositories.MessageRepository;
import com.devtalk.repositories.ThreadRepository;
import com.devtalk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
    private final MessageMentionRepository messageMentionRepository;
    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;
    private final ChannelRepository channelRepository;
    private final ChannelService channelService;


    @Transactional
    public MessageResponseDTO saveMessage(ChatMessageDTO dto, UserResponseDTO user, ChannelResponseDTO channel) {
        Message message = messageMapper.toEntity(dto, user, channel, userMapper, channelMapper);
        
        // Handle threading: if parentMessageId exists, create or find thread
        handleThreading(message, dto, channel);
        
        Message saved = messageRepository.save(message);
        log.info("Saved message {} from user {} to channel {}", saved.getId(), user.getId(), channel.getId());
        
        // Parse and save mentions from message content
        parseAndSaveMentions(saved, dto.getContent());
        
        // Fetch with all details including attachments, reactions, and mentions
        Message messageWithDetails = messageRepository.findByIdWithAllDetails(saved.getId())
                .orElse(saved);
        MessageResponseDTO response = messageMapper.toResponseDTO(messageWithDetails);
        
        setReplyCount(response, saved.getId());
        
        return response;
    }

    @Transactional
    public void addReaction(Long messageId, Long userId, MessageReactionType type) {
        var existing = messageReactionRepository.findByMessage_IdAndUser_IdAndReactionType(messageId, userId, type);
        if (existing.isPresent()) {
            return;
        }

        User user = userRepository.getReferenceById(userId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + messageId));

        MessageReaction reaction = MessageReaction.builder()
                .message(message)
                .user(user)
                .reactionType(type)
                .build();

        messageReactionRepository.save(reaction);
    }

    @Transactional
    public void removeReaction(Long messageId, Long userId, MessageReactionType type) {
        messageReactionRepository.findByMessage_IdAndUser_IdAndReactionType(messageId, userId, type)
                .ifPresent(messageReactionRepository::delete);
    }

    @Transactional
    public MessageResponseDTO addAttachment(AttachmentDTO dto) {
        Message message = messageRepository.findById(dto.getMessageId())
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + dto.getMessageId()));
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
        List<Message> messages = messageRepository.findByContentContainingIgnoreCase(query).stream()
                .limit(limit)
                .map(message -> messageRepository.findByIdWithAllDetails(message.getId())
                        .orElse(message))
                .collect(Collectors.toList());
        
        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        setReplyCountsBatch(result);
        return result;
    }


    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessages(Long channelId, int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Message> messages = messageRepository.findLatestByChannel(channelId, pageRequest).getContent();

        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());

        setReplyCountsBatch(result);
        Collections.reverse(result);
        return result;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getAllChannelMessages(Long channelId) {
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);

        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());

        setReplyCountsBatch(result);
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
        
        setReplyCountsBatch(result);
        Collections.reverse(result);
        return result;
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
        
        // Remove old mentions and parse new ones
        message.clearMentions();
        Message updated = messageRepository.save(message);
        
        // Parse and save new mentions
        parseAndSaveMentions(updated, newContent);
        
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
        Message message = messageRepository.findByIdWithAllDetails(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + messageId));
        MessageResponseDTO dto = messageMapper.toResponseDTO(message);
        
        setReplyCount(dto, messageId);
        
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadReplies(Long parentMessageId) {
        List<Message> replies = messageRepository.findByParentMessageId(parentMessageId);
        List<MessageResponseDTO> result = replies.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        setReplyCountsBatch(result);
        return result;
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getThreadMessages(Long threadId) {
        List<Message> messages = messageRepository.findByThreadId(threadId);
        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        setReplyCountsBatch(result);
        return result;
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
                    setReplyCount(dto, message.getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getMessagesWhereUserMentioned(Long userId) {
        List<MessageMention> mentions = messageMentionRepository.findByMentionedUserId(userId);
        return mentions.stream()
                .map(MessageMention::getMessage)
                .map(message -> {
                    Message messageWithDetails = messageRepository.findByIdWithAllDetails(message.getId())
                            .orElse(message);
                    MessageResponseDTO dto = messageMapper.toResponseDTO(messageWithDetails);
                    setReplyCount(dto, message.getId());
                    return dto;
                })
                .sorted((a, b) -> Long.compare(b.getTimestamp(), a.getTimestamp())) // Sort by newest first
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponseDTO createMessage(CreateMessageRequest request, UserResponseDTO user) {
        ChannelResponseDTO channel = channelService.getChannelDTOById(request.getChannelId());
        
        ChatMessageDTO chatMessageDTO = messageMapper.toChatMessageDTO(request, user.getId());

        return saveMessage(chatMessageDTO, user, channel);
    }

    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getChannelMessagesOnly(Long channelId) {
        if (!channelRepository.existsById(channelId)) {
            throw new NotFoundException("Channel not found with id: " + channelId);
        }
        List<Message> messages = messageRepository.findByChannelIdWithAuthorAndChannel(channelId);
        List<MessageResponseDTO> result = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        setReplyCountsBatch(result);
        return result;
    }

    @Transactional(readOnly = true)
    public MessagesWithMetadataDTO getChannelMessagesWithPagination(Long channelId, int limit, Long before) {
        if (!channelRepository.existsById(channelId)) {
            throw new NotFoundException("Channel not found with id: " + channelId);
        }

        PageRequest pageRequest = PageRequest.of(0, limit + 1, Sort.by(Sort.Direction.DESC, "createdAt"));
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

        List<MessageResponseDTO> messageDTOs = messages.stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
        
        setReplyCountsBatch(messageDTOs);
        Collections.reverse(messageDTOs);

        return messageMapper.toMessagesWithMetadataDTO(messageDTOs, hasMore);
    }

    // Private helper methods

    private void handleThreading(Message message, ChatMessageDTO dto, ChannelResponseDTO channel) {
        if (dto.getParentMessageId() != null) {
            Message parentMessage = messageRepository.findById(dto.getParentMessageId())
                    .orElseThrow(() -> new NotFoundException("Parent message not found: " + dto.getParentMessageId()));
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
                    .orElseThrow(() -> new NotFoundException("Thread not found: " + dto.getThreadId()));
            message.setThread(thread);
            // Set parent message to thread's original message if not explicitly set
            if (message.getParentMessage() == null) {
                message.setParentMessage(thread.getOriginalMessage());
            }
        }
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
        Map<Long, Long> replyCountMap = replyCounts.stream()
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

    // Mention management methods (following same pattern as attachments and reactions)

    private static final Pattern MENTION_PATTERN = Pattern.compile("@([A-Za-z0-9_\\-]+)");

    @Transactional
    private List<MessageMention> parseAndSaveMentions(Message message, String content) {
        if (content == null || content.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<MessageMention> mentions = new ArrayList<>();
        Matcher matcher = MENTION_PATTERN.matcher(content);

        // Track processed usernames to avoid duplicates and repeated DB lookups
        Set<String> processedUsernames = new HashSet<>();

        while (matcher.find()) {
            String username = matcher.group(1);
            int startPos = matcher.start();
            int endPos = matcher.end();
            String usernameLower = username.toLowerCase();

            // Skip if we've already processed this username (found or not found)
            if (processedUsernames.contains(usernameLower)) {
                continue;
            }

            Optional<User> userOpt = userRepository.findByDisplayNameIgnoreCase(username);
            
            if (userOpt.isPresent()) {
                User mentionedUser = userOpt.get();
                
                // Check if mention already exists (shouldn't happen, but safety check)
                Optional<MessageMention> existing = messageMentionRepository
                        .findByMessageIdAndMentionedUserId(message.getId(), mentionedUser.getId());
                
                if (existing.isEmpty()) {
                    MessageMention mention = MessageMention.builder()
                            .message(message)
                            .mentionedUser(mentionedUser)
                            .startPosition(startPos)
                            .endPosition(endPos)
                            .build();
                    
                    MessageMention saved = messageMentionRepository.save(mention);
                    mentions.add(saved);
                    processedUsernames.add(usernameLower);
                    
                    log.debug("Created mention for user {} in message {}", mentionedUser.getDisplayName(), message.getId());
                } else {
                    // Mention already exists, mark as processed
                    processedUsernames.add(usernameLower);
                }
            } else {
                // User not found, mark as processed to avoid repeated DB lookups
                processedUsernames.add(usernameLower);
                log.debug("Mentioned user '{}' not found in message {}", username, message.getId());
            }
        }

        log.info("Parsed {} mentions from message {}", mentions.size(), message.getId());
        return mentions;
    }

    @Transactional(readOnly = true)
    public List<Long> getMentionedUserIds(Long messageId) {
        return messageMentionRepository.findByMessageId(messageId).stream()
                .map(mention -> mention.getMentionedUser().getId())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Long getUnreadMentionCount(Long userId, Long channelId) {
        return messageMentionRepository.countUnreadMentionsInChannel(userId, channelId);
    }
}
