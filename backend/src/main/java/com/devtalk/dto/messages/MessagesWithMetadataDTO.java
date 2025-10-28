package com.devtalk.dto.messages;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagesWithMetadataDTO {
    private List<MessageResponseDTO> messages;
    private boolean hasMore;
}

