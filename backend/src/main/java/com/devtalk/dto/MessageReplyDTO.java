package com.devtalk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageReplyDTO extends MessageBaseDTO {
    private String content;
    private Long parentMessageId;
}
