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
    private String status; 
    private Long serverTimestamp;
    private Long messageId;
    /**
     * The ID of the recipient to whom the message was delivered.
     * <p>
     * Note: This field is not populated by the mapper; it must be set manually if needed.
     */
    private Long recipientId; 
    /**
     * The timestamp (in milliseconds since epoch) when the message was delivered to the recipient.
     * <p>
     * Note: This field is not populated by the mapper; it must be set manually if needed.
     */
    private Long deliveredAt; 
}


