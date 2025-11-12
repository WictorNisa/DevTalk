package com.devtalk.dtos.channel;


import com.devtalk.dtos.base.ChannelBaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ChannelResponseDTO extends ChannelBaseDTO {
}
