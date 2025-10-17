package com.devtalk.dto.base;

import com.devtalk.enums.AttachmentType;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class AttachmentBaseDTO extends BaseDTO {
    private AttachmentType attachmentType;
    private String url;
    private String filename;
    private Long sizeBytes;
    private Long messageId;
}
