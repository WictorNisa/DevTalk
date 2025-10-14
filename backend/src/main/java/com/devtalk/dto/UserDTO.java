package com.devtalk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String displayName;
    private String githubToken;
    private String externalId;
    private Instant createdAt;
    private Instant updatedAt;
}
