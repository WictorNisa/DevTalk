package com.devtalk.dto.base;

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
public abstract class UserBaseDTO extends BaseDTO {
    private String externalId;
    private String displayName;
    private PresenceStatus presenceStatus;
    private Role role;
    private Language language;
    private Theme theme;
    private String avatarUrl;
}
