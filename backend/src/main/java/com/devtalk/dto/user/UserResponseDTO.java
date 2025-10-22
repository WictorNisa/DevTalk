package com.devtalk.dto.user;

import com.devtalk.dto.base.UserBaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class UserResponseDTO extends UserBaseDTO {
}
