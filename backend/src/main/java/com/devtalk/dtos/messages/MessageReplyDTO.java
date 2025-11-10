package com.devtalk.dtos.messages;

import com.devtalk.dtos.base.MessageBaseDTO;
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
