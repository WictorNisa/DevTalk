package com.devtalk.dtos.user;

import com.devtalk.enums.Language;
import com.devtalk.enums.Theme;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String displayName;
    private String avatarUrl;
    private Language language;
    private Theme theme;
}

