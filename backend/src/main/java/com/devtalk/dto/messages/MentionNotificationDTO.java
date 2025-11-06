package com.devtalk.dto.messages;

import com.devtalk.dto.base.MessageBaseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MentionNotificationDTO extends MessageBaseDTO {
    public static final String TYPE = "MENTION";
    @lombok.Builder.Default
    private String type = TYPE;
    private Long mentionedUserId;
    private String mentionedUserName;
    private String senderDisplayName;
    private String senderAvatarUrl;
    private String channelName;
    private String messagePreview; // First 100 chars of message
    private Long timestamp; // Message timestamp
}

