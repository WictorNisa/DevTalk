package com.devtalk.mappers;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.model.Channel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChannelMapper {

    @Mapping(target = "groupId",  source = "group.id")
    ChannelResponseDTO toResponseDTO(Channel channel);

    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "messages", ignore = true) // Messages are mapped separately in service layer
    ChannelMessagesDTO toResponseMessagesDTO(Channel channel);

    @Mapping(target = "group", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Channel toEntity(ChannelResponseDTO dto);

    @Mapping(target = "group", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "messages", ignore = true) // Messages are not mapped in reverse
    Channel toEntity(ChannelMessagesDTO dto);
}
