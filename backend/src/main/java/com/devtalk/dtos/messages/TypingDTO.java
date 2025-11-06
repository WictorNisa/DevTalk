package com.devtalk.dtos.messages;

import com.devtalk.dtos.base.MessageBaseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TypingDTO extends MessageBaseDTO {
    private boolean typing;
}


