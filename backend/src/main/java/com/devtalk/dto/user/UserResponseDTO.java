package com.devtalk.dto.user;

import com.devtalk.dto.base.UserBaseDTO;
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
