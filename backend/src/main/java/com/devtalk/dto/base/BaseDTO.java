package com.devtalk.dto.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

public class BaseDTO {
    private Long id;
    private Instant createdAt;
    private Instant updatedAt;
}
