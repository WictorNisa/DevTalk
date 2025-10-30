package com.devtalk.mappers;

import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.model.Message;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "channelId", source = "channel.id")
    @Mapping(target = "threadId", source = "thread.id")
    @Mapping(target = "parentMessageId", source = "parentMessage.id")
    @Mapping(target = "senderDisplayName", source = "user.displayName")
    @Mapping(target = "senderAvatarUrl", source = "user.avatarUrl")
    @Mapping(target = "timestamp", ignore = true)
    MessageResponseDTO toResponseDTO(Message message);

    @AfterMapping
    default void setTimestamp(@MappingTarget MessageResponseDTO dto, Message message) {
        if (message.getCreatedAt() != null) {
            dto.setTimestamp(message.getCreatedAt().toEpochMilli());
        } else {
            dto.setTimestamp(System.currentTimeMillis());
        }
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "channel", ignore = true)
    @Mapping(target = "thread", ignore = true)
    @Mapping(target = "parentMessage", ignore = true)
    @Mapping(target = "editedAt", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "reactions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Message toEntity(ChatMessageDTO dto);
}
