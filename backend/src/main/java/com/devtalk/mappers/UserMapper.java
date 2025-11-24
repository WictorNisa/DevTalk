package com.devtalk.mappers;

import com.devtalk.dtos.base.UserBaseDTO;
import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.dtos.user.UserStatusDTO;
import com.devtalk.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "isOnline", source = "online")
    UserResponseDTO toResponseDTO(User user);

    @Mapping(target = "userId", source = "id")
    @Mapping(target = "status", source = "presenceStatus")
    UserStatusDTO toStatusDTO(User user);

    @Mapping(target = "groupMemberships", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "relationships", ignore = true)
    @Mapping(target = "relatedBy", ignore = true)
    @Mapping(target = "isOnline", source = "online")
    User toEntity(UserBaseDTO dto);

    default User toEntity(UserResponseDTO dto) {
        return toEntity((UserBaseDTO) dto);
    }
}


