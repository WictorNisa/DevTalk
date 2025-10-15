package com.devtalk.dto.base;

import com.devtalk.enums.UserGroupMembershipType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class UserGroupRelationshipBaseDTO extends BaseDTO {
    private Long userId;
    private Long groupId;
    private UserGroupMembershipType userGroupMembershipType;
}
