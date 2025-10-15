package com.devtalk.dto;

import com.devtalk.dto.base.UserBaseDTO;
import com.devtalk.enums.Language;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.enums.Role;
import com.devtalk.enums.Theme;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserResponseDTO extends UserBaseDTO {
    private String avatarUrl;
}
