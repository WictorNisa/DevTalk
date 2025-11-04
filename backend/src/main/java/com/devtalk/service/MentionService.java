package com.devtalk.service;

import com.devtalk.model.Message;
import com.devtalk.model.MessageMention;
import com.devtalk.model.User;
import com.devtalk.repository.MessageMentionRepository;
import com.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentionService {

    private final UserRepository userRepository;
    private final MessageMentionRepository messageMentionRepository;

    // Pattern to match @username (alphanumeric, underscore, hyphen, allows spaces after @)
    private static final Pattern MENTION_PATTERN = Pattern.compile("@([A-Za-z0-9_\\-]+)");

    /**
     * Parse mentions from message content and create MessageMention entities
     * @param message The message containing mentions
     * @param content The message content to parse
     * @return List of created MessageMention entities
     */
    @Transactional
    public List<MessageMention> parseAndSaveMentions(Message message, String content) {
        if (content == null || content.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<MessageMention> mentions = new ArrayList<>();
        Matcher matcher = MENTION_PATTERN.matcher(content);

        // Track found usernames to avoid duplicates
        Set<String> foundUsernames = new HashSet<>();

        while (matcher.find()) {
            String username = matcher.group(1);
            int startPos = matcher.start();
            int endPos = matcher.end();

            // Skip if we've already processed this username in this message
            if (foundUsernames.contains(username.toLowerCase())) {
                continue;
            }

            // Find user by displayName (case-insensitive)
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
                    foundUsernames.add(username.toLowerCase());
                    
                    log.debug("Created mention for user {} in message {}", mentionedUser.getDisplayName(), message.getId());
                }
            } else {
                log.debug("Mentioned user '{}' not found in message {}", username, message.getId());
            }
        }

        log.info("Parsed {} mentions from message {}", mentions.size(), message.getId());
        return mentions;
    }

    /**
     * Get all mentioned user IDs for a message
     */
    @Transactional(readOnly = true)
    public List<Long> getMentionedUserIds(Long messageId) {
        return messageMentionRepository.findByMessageId(messageId).stream()
                .map(mention -> mention.getMentionedUser().getId())
                .collect(Collectors.toList());
    }

    /**
     * Get all mentions for a user (for notifications)
     */
    @Transactional(readOnly = true)
    public List<MessageMention> getMentionsForUser(Long userId) {
        return messageMentionRepository.findByMentionedUserId(userId);
    }

    /**
     * Get mention count for a user in a channel (for unread mentions badge)
     */
    @Transactional(readOnly = true)
    public Long getUnreadMentionCount(Long userId, Long channelId) {
        return messageMentionRepository.countUnreadMentionsInChannel(userId, channelId);
    }
}

