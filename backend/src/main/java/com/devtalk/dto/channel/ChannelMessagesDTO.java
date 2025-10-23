package com.devtalk.dto.channel;

import com.devtalk.dto.base.ChannelBaseDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ChannelMessagesDTO extends ChannelBaseDTO {
    private List<MessageResponseDTO> messages;
}
