package com.devtalk.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "channels", indexes = {
    @Index(name = "idx_channel_group", columnList = "group_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Channel extends BaseEntity {

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @OneToMany(mappedBy = "channel", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<Message> messages = new HashSet<>();

    @OneToMany(mappedBy = "channel", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<Thread> threads = new HashSet<>();
}


