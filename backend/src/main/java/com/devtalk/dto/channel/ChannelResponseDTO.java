package com.devtalk.dto.channel;


import com.devtalk.dto.base.ChannelBaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ChannelResponseDTO extends ChannelBaseDTO {
}
