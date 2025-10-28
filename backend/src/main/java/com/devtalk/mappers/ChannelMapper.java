package com.devtalk.mappers;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.model.Channel;
import com.devtalk.model.Group;
import org.springframework.stereotype.Component;

@Component
public class ChannelMapper {

    public ChannelResponseDTO toResponseDTO(Channel channel) {
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

    public ChannelMessagesDTO toResponseMessagesDTO(Channel channel) {
        if (channel == null) {
            return null;
        }
        return ChannelMessagesDTO.builder()
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

    public Channel toEntity(ChannelMessagesDTO dto) {
        if (dto == null) {
            return null;
        }

        Channel.ChannelBuilder<?, ?> builder = Channel.builder()
                .id(dto.getId())
                .name(dto.getName());

        return builder.build();
    }
}
