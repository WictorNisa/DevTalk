package com.devtalk.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.devtalk.enums.Language;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.enums.Role;
import com.devtalk.enums.Theme;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_external_id", columnList = "externalId"),
    @Index(name = "idx_user_presence", columnList = "presenceStatus")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class User extends BaseEntity {

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, unique = true, length = 255)
    private String externalId;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    @Builder.Default
    private PresenceStatus presenceStatus = PresenceStatus.OFFLINE;

    @Column(nullable = false)
    @Builder.Default
    private boolean isOnline = false;
    
    @Column(name = "last_activity_at")
    private Instant lastActivityAt;

    @Size(max = 100)
    @Column(name = "custom_status_message", length = 100)
    private String customStatusMessage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    @Builder.Default
    private Role role = Role.ADMIN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    @Builder.Default
    private Language language = Language.EN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    @Builder.Default
    private Theme theme = Theme.LIGHT;

    @Size(max = 512)
    @Column(length = 512)
    private String avatarUrl;

    @OneToMany(mappedBy = "user", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<UserGroupMembership> groupMemberships = new HashSet<>();

    @OneToMany(mappedBy = "user", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private Set<Message> messages = new HashSet<>();

    @OneToMany(mappedBy = "user", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<UserRelationship> relationships = new HashSet<>();

    @OneToMany(mappedBy = "relatedUser", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<UserRelationship> relatedBy = new HashSet<>();
}


