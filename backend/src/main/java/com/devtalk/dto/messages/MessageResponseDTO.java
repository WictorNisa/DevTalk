package com.devtalk.dto.messages;

import com.devtalk.dto.base.AttachmentBaseDTO;
import com.devtalk.dto.base.MessageBaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Map;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MessageResponseDTO extends MessageBaseDTO {
    /**
     * The actual text content of the message.
     */
    private String content;
    private String senderDisplayName;
    private String senderAvatarUrl;
    private Long timestamp;
    private Long editedAt; // Timestamp when message was edited (null if not edited)
    private Boolean isEdited; // Convenience flag for UI
    private List<AttachmentBaseDTO> attachments; // List of attachments
    private Map<com.devtalk.enums.MessageReactionType, Long> reactions; // Reaction type -> count
    private Map<com.devtalk.enums.MessageReactionType, List<Long>> reactionUsers; // Reaction type -> list of user IDs who reacted
    private Integer replyCount; // Number of replies if this is a parent message
    private List<Long> mentionedUserIds; // List of user IDs mentioned in this message
}
