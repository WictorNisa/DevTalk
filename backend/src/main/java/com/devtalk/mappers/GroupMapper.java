package com.devtalk.mappers;


import com.devtalk.dtos.groups.GroupResponseDTO;
import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.models.Group;
import com.devtalk.models.UserGroupMembership;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Set;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring", uses = {ChannelMapper.class, UserMapper.class})
public interface GroupMapper {

    @Mapping(target = "name", source = "groupName")
    @Mapping(target = "members", ignore = true) // Handled in @AfterMapping
    GroupResponseDTO toResponseDTO(Group group);

    @AfterMapping
    default void extractUsersFromMemberships(@MappingTarget GroupResponseDTO dto, Group group, UserMapper userMapper) {
        if (group.getMemberships() != null && !group.getMemberships().isEmpty()) {
            Set<UserResponseDTO> users = group.getMemberships().stream()
                    .map(UserGroupMembership::getUser)
                    .filter(user -> user != null)
                    .map(userMapper::toResponseDTO)
                    .collect(Collectors.toSet());
            dto.setMembers(users);
        }
    }
}
