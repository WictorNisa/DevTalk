package com.devtalk.model;

import com.devtalk.enums.UserGroupMembershipType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "user_group_memberships",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "group_id"}),
       indexes = {
           @Index(name = "idx_user_group", columnList = "user_id,group_id"),
           @Index(name = "idx_membership_type", columnList = "type")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class UserGroupMembership extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    @Builder.Default
    private UserGroupMembershipType type = UserGroupMembershipType.MEMBER;
}


