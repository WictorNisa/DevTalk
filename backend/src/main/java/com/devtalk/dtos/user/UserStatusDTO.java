package com.devtalk.dtos.user;

import com.devtalk.enums.PresenceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusDTO {
    private Long userId;
    private PresenceStatus status;
    private String customStatusMessage;
    private Instant lastActivityAt;
}

