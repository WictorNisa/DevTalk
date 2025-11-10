package com.devtalk.dtos.channel;

import com.devtalk.dtos.base.ChannelBaseDTO;
import com.devtalk.dtos.messages.MessageResponseDTO;
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
