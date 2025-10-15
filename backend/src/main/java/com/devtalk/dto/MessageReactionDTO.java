package com.devtalk.dto;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.enums.MessageReactionType;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MessageReactionDTO extends MessageBaseDTO {
    private Long reactionCount;
    private MessageReactionType reactionType;
}
