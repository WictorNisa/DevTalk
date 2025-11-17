package com.devtalk.dtos.user;

import com.devtalk.enums.PresenceStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserStatusRequest {
    @NotNull(message = "Status is required")
    private PresenceStatus status;
    
    @Size(max = 100, message = "Custom status message must not exceed 100 characters")
    private String customStatusMessage;
}

