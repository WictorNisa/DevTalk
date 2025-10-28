package com.devtalk.dto.messages;

import com.devtalk.dto.base.MessageBaseDTO;
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

