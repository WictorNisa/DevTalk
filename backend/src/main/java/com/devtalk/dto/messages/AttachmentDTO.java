package com.devtalk.dto.messages;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.enums.AttachmentType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AttachmentDTO extends MessageBaseDTO {
    private Long messageId;
    private AttachmentType type;
    private String url;
    private String filename;
    private Long sizeBytes;
}


