package com.devtalk.dtos.channel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateChannelRequest {
    @NotBlank(message = "Channel name is required")
    private String name;

    @NotNull(message = "GroupId is required")
    private Long groupId;
}

