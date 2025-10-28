package com.devtalk.mappers;

import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.model.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {


    public MessageResponseDTO toResponseDTO(Message message) {
        if (message == null) {
            return null;
        }

        return MessageResponseDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .userId(message.getUser() != null ? message.getUser().getId() : null)
                .channelId(message.getChannel() != null ? message.getChannel().getId() : null)
                .threadId(message.getThread() != null ? message.getThread().getId() : null)
                .parentMessageId(message.getParentMessage() != null ? message.getParentMessage().getId() : null)
                .senderDisplayName(message.getUser() != null ? message.getUser().getDisplayName() : null)
                .senderAvatarUrl(message.getUser() != null ? message.getUser().getAvatarUrl() : null)
                .timestamp(message.getCreatedAt() != null ? message.getCreatedAt().toEpochMilli() : System.currentTimeMillis())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }


    public Message toEntity(ChatMessageDTO dto) {
        if (dto == null) {
            return null;
        }

        return Message.builder()
                .content(dto.getContent())
                .user(null)
                .channel(null)
                .build();
    }


}
