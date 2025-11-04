package com.devtalk.controller;

import com.devtalk.dto.user.UpdateUserRequest;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users", description = "User management and retrieval operations")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all users"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves a specific user by their unique identifier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved user"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<UserResponseDTO> getUserById(
            @Parameter(description = "User ID", required = true, example = "1")
            @PathVariable Long id) {
        try {
            UserResponseDTO user = userService.getUserDTOById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error retrieving user {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile", description = "Updates a user's profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid input"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<UserResponseDTO> updateUser(
            @Parameter(description = "User ID", required = true, example = "1")
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            UserResponseDTO updated = userService.updateUser(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            log.error("Error updating user {}: {}", id, e.getMessage());
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().build();
        }
    }
}
