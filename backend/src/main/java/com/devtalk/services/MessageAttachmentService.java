package com.devtalk.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devtalk.dtos.messages.AttachmentDTO;
import com.devtalk.dtos.messages.MessageResponseDTO;
import com.devtalk.exceptions.NotFoundException;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.models.Attachment;
import com.devtalk.models.Message;
import com.devtalk.repositories.AttachmentRepository;
import com.devtalk.repositories.MessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class MessageAttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;

    @Transactional
    public MessageResponseDTO addAttachment(AttachmentDTO dto) {
        if(dto == null) return new MessageResponseDTO();
        if(dto.getMessageId() != null){
        Message message = messageRepository.findById(dto.getMessageId())
                .orElseThrow(() -> new NotFoundException("Message not found with id: " + dto.getMessageId()));

        Attachment attachment = Attachment.builder()
                .message(message)
                .type(dto.getType())
                .url(dto.getUrl())
                .filename(dto.getFilename())
                .sizeBytes(dto.getSizeBytes())
                .build();
        if(attachment != null)
        attachmentRepository.save(attachment);
        return messageMapper.toResponseDTO(messageRepository.findByIdWithAllDetails(message.getId())
                .orElseThrow());
        }
        return new MessageResponseDTO();
    }
}

