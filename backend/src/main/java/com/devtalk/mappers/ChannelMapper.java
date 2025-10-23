package com.devtalk.mappers;

import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.model.Channel;
import org.springframework.stereotype.Component;

@Component
public class ChannelMapper {

    public ChannelResponseDTO toDTO(Channel channel) {
        if (channel == null) {
            return null;
        }

        return ChannelResponseDTO.builder()
                .id(channel.getId())
                .name(channel.getName())
                .groupId(channel.getGroup() != null ? channel.getGroup().getId() : null)
                .createdAt(channel.getCreatedAt())
                .updatedAt(channel.getUpdatedAt())
                .build();
    }

    public Channel toEntity(ChannelResponseDTO dto) {
        if (dto == null) {
            return null;
        }

        Channel.ChannelBuilder<?, ?> builder = Channel.builder()
                .id(dto.getId())
                .name(dto.getName());

        // TODO: Group relationship needs to be set separately (in service layer)

        return builder.build();
    }
}
