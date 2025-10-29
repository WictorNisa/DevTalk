package com.devtalk.dto.messages;

import com.devtalk.dto.base.MessageBaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MessageResponseDTO extends MessageBaseDTO {
    private String content;
    private String senderDisplayName;
    private String senderAvatarUrl;
    private Long timestamp;
}
