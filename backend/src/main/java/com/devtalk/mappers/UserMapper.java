package com.devtalk.mappers;

import com.devtalk.dto.base.UserBaseDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.model.User;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface UserMapper {

   UserResponseDTO toResponseDTO(User user);

   User toEntity(UserResponseDTO dto);
}


