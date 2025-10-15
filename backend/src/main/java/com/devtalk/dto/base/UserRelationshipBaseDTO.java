package com.devtalk.dto.base;

import com.devtalk.enums.RelationshipType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserRelationshipBaseDTO extends BaseDTO{
    private Long userId;
    private Long relatedUserId;
    private RelationshipType relationshipType;
}
