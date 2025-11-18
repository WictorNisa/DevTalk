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
        if (oauth2User == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        String externalId = oauth2User.getAttribute("login"); // GitHub login

        return userService.getUserByExternalId(externalId);
    }
}