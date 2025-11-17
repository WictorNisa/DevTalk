package com.devtalk.controllers;

import com.devtalk.dtos.user.UpdateUserRequest;
import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.services.UserService;
import com.devtalk.services.UserStatusService;
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
    private final UserStatusService userStatusService; 

    @GetMapping("")
    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users")
    @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all users"),
    @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/status")
    @Operation(summary = "Get users by presence status", description = "Retrieves users filtered by their presence status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved users by presence status"),
        @ApiResponse(responseCode = "400", description = "Bad request - invalid presence status"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<UserResponseDTO>> getUsersByPresenceStatus(
        @Parameter(description = "Presence name", required = true, example = "ONLINE")
        @RequestParam PresenceStatus status
    ){
        return ResponseEntity.ok(userStatusService.getUsersByPresenceStatus(status));
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
        UserResponseDTO user = userService.getUserDTOById(id);
        return ResponseEntity.ok(user);
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
        UserResponseDTO updated = userService.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }

    
}
