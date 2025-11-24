package com.devtalk.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.enums.MessageReactionType;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.models.Message;
import com.devtalk.models.MessageReaction;
import com.devtalk.models.User;
import com.devtalk.repositories.MessageReactionRepository;
import com.devtalk.repositories.MessageRepository;
import com.devtalk.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class MessageReactionService {

    private final MessageReactionRepository messageReactionRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

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
}

