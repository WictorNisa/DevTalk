package com.devtalk.mappers;

import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.model.Channel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChannelMapper {

    @Mapping(target = "groupId",  source = "group.id")
    ChannelResponseDTO toResponseDTO(Channel channel);

    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "messages", ignore = true) // Messages are set via @AfterMapping
    ChannelMessagesDTO toResponseMessagesDTO(Channel channel);

    default ChannelMessagesDTO toResponseMessagesDTO(Channel channel, List<MessageResponseDTO> messages) {
        ChannelMessagesDTO dto = toResponseMessagesDTO(channel);
        dto.setMessages(messages);
        return dto;
    }

    @Mapping(target = "group", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "threads", ignore = true)
    Channel toEntity(ChannelResponseDTO dto);

    @Mapping(target = "group", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "messages", ignore = true) // Messages are not mapped in reverse
    @Mapping(target = "threads", ignore = true)
    Channel toEntity(ChannelMessagesDTO dto);
}
