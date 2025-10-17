package com.devtalk.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MessageReplyDTO extends MessageBaseDTO {
    private String content;
    private Long parentMessageId;
}
