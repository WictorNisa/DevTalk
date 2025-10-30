package com.devtalk.dto.messages;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagesWithMetadataDTO {
    private List<MessageResponseDTO> messages;
    private boolean hasMore;
}

