package com.devtalk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@Tag(name = "Auth", description = "Auth API")
public class AuthController {

    @GetMapping("/api/me")
    @Operation(summary = "Get current user", description = "Gets the current user")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User user){
        return ResponseEntity.ok(user.getAttributes());
    }
}
