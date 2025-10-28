package com.devtalk.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups", indexes = {
    @Index(name = "idx_group_name", columnList = "groupName")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Group extends BaseEntity {

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, unique = true, length = 255)
    private String groupName;

    @OneToMany(mappedBy = "group", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<UserGroupMembership> memberships = new HashSet<>();

    @OneToMany(mappedBy = "group", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<Channel> channels = new HashSet<>();
}


