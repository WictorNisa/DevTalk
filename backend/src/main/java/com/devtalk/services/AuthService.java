package com.devtalk.services;

import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.dtos.user.UserStatusDTO;
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
    private final UserStatusService userStatusService;

    @Transactional(readOnly = true)
    public UserResponseDTO getAuthenticatedUser(OAuth2User oauth2User) {
        if (oauth2User == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        
        String externalId = oauth2User.getAttribute("id").toString(); // GitHub login

        return userService.getUserByExternalId(externalId);
    }

    @Transactional(readOnly = true)
    public UserStatusDTO getAuthenticatedUserStatus(OAuth2User oauth2User) {
        if (oauth2User == null) {
            throw new UnauthorizedException("User not authenticated");
        }

        String externalId = oauth2User.getAttribute("id"); // GitHub login

        return userStatusService.getUserStatusByExternalId(externalId);
    }
}