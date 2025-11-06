package com.devtalk.dto.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class MessageBaseDTO extends BaseDTO {
    private String content;
    private Long userId;
    private Long channelId;
    private Long threadId;
    private Long parentMessageId;
    private Long beforeTimestamp;
    private Long messageId; // For endpoints that need to reference a specific message
}
