package com.devtalk.dto;

import com.devtalk.enums.Language;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.enums.Role;
import com.devtalk.enums.Theme;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO extends UserDTO{
    private PresenceStatus presenceStatus;
    private String statusMessage;
    private Role role;
    private Language language;
    private Theme theme;
}
