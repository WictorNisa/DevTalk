package com.devtalk.mappers;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.model.Channel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface ChannelMapper {

    @Mapping(target = "groupId",  source = "group.id")
    ChannelResponseDTO toResponseDTO(Channel channel);

    @Mapping(target = "groupId", source = "group.id")
    ChannelMessagesDTO toResponseMessagesDTO(Channel channel);

    @Mapping(target = "group", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Channel toEntity(ChannelResponseDTO dto);

    @Mapping(target = "group", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Channel toEntity(ChannelMessagesDTO dto);
}
