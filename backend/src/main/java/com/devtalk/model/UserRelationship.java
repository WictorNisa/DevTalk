package com.devtalk.model;

import com.devtalk.enums.RelationshipType;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "user_relationships",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "related_user_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class UserRelationship extends BaseEntity {

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "related_user_id", nullable = false)
    private User relatedUser;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    @Builder.Default
    private RelationshipType type = RelationshipType.FRIEND;
}
