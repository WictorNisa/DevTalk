package com.devtalk.mappers;

import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

   UserResponseDTO toResponseDTO(User user);

        return UserResponseDTO.builder()
                .id(user.getId())
                .externalId(user.getExternalId())
                .displayName(user.getDisplayName())
                .presenceStatus(user.getPresenceStatus())
                .role(user.getRole())
                .language(user.getLanguage())
                .theme(user.getTheme())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public User toEntity(UserBaseDTO dto) {
        if (dto == null) {
            return null;
        }

        return User.builder()
                .id(dto.getId())
                .externalId(dto.getExternalId())
                .displayName(dto.getDisplayName())
                .presenceStatus(dto.getPresenceStatus())
                .role(dto.getRole())
                .language(dto.getLanguage())
                .theme(dto.getTheme())
                .avatarUrl(dto.getAvatarUrl())
                .build();
    }

    public User toEntityById(Long userId) {
        return null;
    }
}


