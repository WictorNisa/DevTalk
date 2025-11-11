package com.devtalk.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.dtos.messages.ChatMessageDTO;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.mappers.ChannelMapper;
import com.devtalk.models.Message;
import com.devtalk.models.Thread;
import com.devtalk.repositories.MessageRepository;
import com.devtalk.repositories.ThreadRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageThreadService {

    private final ThreadRepository threadRepository;
    private final MessageRepository messageRepository;
    private final ChannelMapper channelMapper;

    @Transactional
    public void handleThreading(Message message, ChatMessageDTO dto, ChannelResponseDTO channel) {
        if (dto.getParentMessageId() != null) {
            Message parentMessage = messageRepository.findById(dto.getParentMessageId())
                    .orElseThrow(() -> new NotFoundException("Parent message not found: " + dto.getParentMessageId()));
            message.setParentMessage(parentMessage);

            Thread thread = threadRepository.findByOriginalMessageId(dto.getParentMessageId())
                    .orElseGet(() -> {
                        Thread newThread = Thread.builder()
                                .channel(channelMapper.toEntity(channel))
                                .originalMessage(parentMessage)
                                .build();
                        return threadRepository.save(newThread);
                    });
            message.setThread(thread);
        } else if (dto.getThreadId() != null) {
            Thread thread = threadRepository.findById(dto.getThreadId())
                    .orElseThrow(() -> new NotFoundException("Thread not found: " + dto.getThreadId()));
            message.setThread(thread);
            if (message.getParentMessage() == null) {
                message.setParentMessage(thread.getOriginalMessage());
            }
        }
    }
}

