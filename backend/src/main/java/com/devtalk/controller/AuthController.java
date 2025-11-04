package com.devtalk.controller;

import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Auth", description = "Auth API")
public class AuthController {

    private final UserService userService;

    @GetMapping("/api/me")
    @Operation(summary = "Get current user", description = "Gets the current authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            if (oauth2User == null) {
                return ResponseEntity.status(401).build();
            }
            String externalId = oauth2User.getAttribute("login"); // GitHub login
            if (externalId == null) {
                externalId = oauth2User.getName();
            }
            String displayName = oauth2User.getAttribute("name");
            if (displayName == null) {
                displayName = externalId;
            }
            UserResponseDTO user = userService.createOrGetUser(externalId, displayName);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error retrieving current user: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
