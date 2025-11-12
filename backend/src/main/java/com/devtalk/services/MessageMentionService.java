package com.devtalk.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.models.Message;
import com.devtalk.models.MessageMention;
import com.devtalk.models.User;
import com.devtalk.repositories.MessageMentionRepository;
import com.devtalk.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageMentionService {

    private final MessageMentionRepository messageMentionRepository;
    private final UserRepository userRepository;
    private static final Pattern MENTION_PATTERN = Pattern.compile("@([A-Za-z0-9_\\-]+)");

    @Transactional
    public List<MessageMention> parseAndSaveMentions(Message message, String content) {
        if (content == null || content.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<MessageMention> mentions = new ArrayList<>();
        Matcher matcher = MENTION_PATTERN.matcher(content);
        Set<String> processedUsernames = new HashSet<>();

        while (matcher.find()) {
            String username = matcher.group(1);
            int startPos = matcher.start();
            int endPos = matcher.end();
            String usernameLower = username.toLowerCase();

            if (processedUsernames.contains(usernameLower)) {
                continue;
            }

            Optional<User> userOpt = userRepository.findByDisplayNameIgnoreCase(username);

            if (userOpt.isPresent()) {
                User mentionedUser = userOpt.get();
                Optional<MessageMention> existing = messageMentionRepository
                        .findByMessageIdAndMentionedUserId(message.getId(), mentionedUser.getId());

                if (existing.isEmpty()) {
                    MessageMention mention = MessageMention.builder()
                            .message(message)
                            .mentionedUser(mentionedUser)
                            .startPosition(startPos)
                            .endPosition(endPos)
                            .build();
                    if(mention == null) return new ArrayList<>();
                    MessageMention saved = messageMentionRepository.save(mention);
                    if(saved != null){
                    mentions.add(saved);
                    }
                    processedUsernames.add(usernameLower);
                    log.debug("Created mention for user {} in message {}", mentionedUser.getDisplayName(), message.getId());
                } else {
                    processedUsernames.add(usernameLower);
                }
            } else {
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

