package com.devtalk.mappers;

import com.devtalk.dto.base.AttachmentBaseDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.enums.MessageReactionType;
import com.devtalk.model.Attachment;
import com.devtalk.model.Message;
import com.devtalk.model.MessageReaction;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "channelId", source = "channel.id")
    @Mapping(target = "threadId", source = "thread.id")
    @Mapping(target = "parentMessageId", source = "parentMessage.id")
    @Mapping(target = "senderDisplayName", source = "user.displayName")
    @Mapping(target = "senderAvatarUrl", source = "user.avatarUrl")
    @Mapping(target = "timestamp", ignore = true)
    @Mapping(target = "editedAt", ignore = true)
    @Mapping(target = "isEdited", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "reactions", ignore = true)
    @Mapping(target = "reactionUsers", ignore = true)
    @Mapping(target = "replyCount", ignore = true)
    MessageResponseDTO toResponseDTO(Message message);

    @AfterMapping
    default void setTimestamp(@MappingTarget MessageResponseDTO dto, Message message) {
        if (message.getCreatedAt() != null) {
            dto.setTimestamp(message.getCreatedAt().toEpochMilli());
        } else {
            dto.setTimestamp(System.currentTimeMillis());
        }
    }

    @AfterMapping
    default void setEditedAt(@MappingTarget MessageResponseDTO dto, Message message) {
        if (message.getEditedAt() != null) {
            dto.setEditedAt(message.getEditedAt().toEpochMilli());
            dto.setIsEdited(true);
        } else {
            dto.setEditedAt(null);
            dto.setIsEdited(false);
        }
    }

    @AfterMapping
    default void setAttachments(@MappingTarget MessageResponseDTO dto, Message message) {
        if (message.getAttachments() != null && !message.getAttachments().isEmpty()) {
            List<AttachmentBaseDTO> attachmentDTOs = message.getAttachments().stream()
                    .map(this::mapAttachment)
                    .collect(Collectors.toList());
            dto.setAttachments(attachmentDTOs);
        } else {
            dto.setAttachments(Collections.emptyList());
        }
    }

    @AfterMapping
    default void setReactions(@MappingTarget MessageResponseDTO dto, Message message) {
        if (message.getReactions() != null && !message.getReactions().isEmpty()) {
            // Group reactions by type
            Map<MessageReactionType, Long> reactionCounts = message.getReactions().stream()
                    .collect(Collectors.groupingBy(
                            MessageReaction::getReactionType,
                            Collectors.counting()
                    ));
            dto.setReactions(reactionCounts);

            // Group user IDs by reaction type
            Map<MessageReactionType, List<Long>> reactionUsersMap = message.getReactions().stream()
                    .collect(Collectors.groupingBy(
                            MessageReaction::getReactionType,
                            Collectors.mapping(
                                    reaction -> reaction.getUser().getId(),
                                    Collectors.toList()
                            )
                    ));
            dto.setReactionUsers(reactionUsersMap);
        } else {
            dto.setReactions(Collections.emptyMap());
            dto.setReactionUsers(Collections.emptyMap());
        }
    }

    @AfterMapping
    default void setReplyCount(@MappingTarget MessageResponseDTO dto, Message message) {
        // Reply count will be set by service layer after mapping
        // Set to 0 initially, service will update if message is a parent
        dto.setReplyCount(0);
    }

    default AttachmentBaseDTO mapAttachment(Attachment attachment) {
        return AttachmentBaseDTO.builder()
                .id(attachment.getId())
                .type(attachment.getType())
                .url(attachment.getUrl())
                .filename(attachment.getFilename())
                .sizeBytes(attachment.getSizeBytes())
                .messageId(attachment.getMessage().getId())
                .createdAt(attachment.getCreatedAt())
                .updatedAt(attachment.getUpdatedAt())
                .build();
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
