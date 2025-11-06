package com.devtalk.controller;

import com.devtalk.model.User;
import com.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Auth", description = "Auth API")
@RequiredArgsConstructor  
public class AuthController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/api/me")
    @Operation(summary = "Get current user", description = "Gets the current user")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User oAuth2User) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        
        String externalId = oAuth2User.getAttribute("id").toString();
        User user = userRepository.findByExternalId(externalId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("externalId", user.getExternalId());
        response.put("displayName", user.getDisplayName()); 
        response.put("avatarUrl", user.getAvatarUrl());     
        
        return ResponseEntity.ok(response);
    }
}