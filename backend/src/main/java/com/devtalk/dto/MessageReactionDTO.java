package com.devtalk.dto;

import com.devtalk.enums.MessageReactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageReactionDTO extends MessageBaseDTO{
    private Long reactionCount;
    private MessageReactionType reactionType;
}
