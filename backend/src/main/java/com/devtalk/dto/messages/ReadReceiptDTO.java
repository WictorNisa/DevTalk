package com.devtalk.dto.messages;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ReadReceiptDTO {
    private Long channelId;
    private Long messageId;
    private Long userId;
    private Long readAt;
}