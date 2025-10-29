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
public class ReadReceiptDTO extends MessageBaseDTO {
    private Long channelId;
    private Long messageId;
    private Long userId;
    private Long readAt;
}