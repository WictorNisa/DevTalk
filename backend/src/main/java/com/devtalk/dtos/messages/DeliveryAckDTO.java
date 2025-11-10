package com.devtalk.dtos.messages;

import com.devtalk.dtos.base.MessageBaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DeliveryAckDTO extends MessageBaseDTO {
    private String status; // e.g., "DELIVERED"
    private Long serverTimestamp;
    private Long messageId;
}


