package com.devtalk.services;

import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserService userService;

    @Transactional(readOnly = true)
    public UserResponseDTO getAuthenticatedUser(OAuth2User oauth2User) {
        Object idAttribute = oauth2User.getAttribute("id");

        if (idAttribute == null) {
            throw new UnauthorizedException("OAuth2User does not contain 'id' attribute");
        }

        return userService.getUserByExternalId(idAttribute.toString());
    }
}