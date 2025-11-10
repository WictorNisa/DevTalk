package com.devtalk.dtos.messages;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMessageRequest {
    @NotNull(message = "ChannelId is required")
    private Long channelId;

    @NotBlank(message = "Content is required")
    private String content;

    private Long parentMessageId; // Optional: for threading
    private Long threadId; // Optional: for threading
}

