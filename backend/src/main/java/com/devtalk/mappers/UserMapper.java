package com.devtalk.mappers;

import com.devtalk.dto.base.UserBaseDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toResponseDTO(User user);

    @Mapping(target = "groupMemberships", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "relationships", ignore = true)
    @Mapping(target = "relatedBy", ignore = true)
    User toEntity(UserBaseDTO dto);

    default User toEntity(UserResponseDTO dto) {
        return toEntity((UserBaseDTO) dto);
    }
}


