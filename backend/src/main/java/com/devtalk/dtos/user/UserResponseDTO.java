package com.devtalk.dtos.user;

import com.devtalk.dtos.base.UserBaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class UserResponseDTO extends UserBaseDTO {
}
