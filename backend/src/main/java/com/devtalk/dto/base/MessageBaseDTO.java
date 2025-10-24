package com.devtalk.dto.base;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MessageBaseDTO extends BaseDTO {
    private String content;
    private Long userId;
    private Long channelId;
    private Long threadId;
    private Long parentMessageId;
    private Long beforeTimestamp;
}
