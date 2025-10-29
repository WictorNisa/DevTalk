package com.devtalk.dto.messages;

import com.devtalk.dto.base.MessageBaseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDeleteDTO extends MessageBaseDTO {
    private Long messageId;
    private Long userId;
    private Long channelId;
}


