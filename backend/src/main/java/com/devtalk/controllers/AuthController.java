package com.devtalk.controllers;

import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Auth API")
public class AuthController {

    private final AuthService authService;

    @GetMapping("/api/me")
    @Operation(summary = "Get current user", description = "Gets the current authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        UserResponseDTO user = authService.getAuthenticatedUser(oauth2User);
        return ResponseEntity.ok(user);
    }
}
