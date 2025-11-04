package com.devtalk.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_message_channel", columnList = "channel_id"),
    @Index(name = "idx_message_user", columnList = "user_id"),
    @Index(name = "idx_message_created", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Message extends BaseEntity {

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT", length = 1000)
    private String content;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @Column
    private Instant editedAt;

    @ManyToOne
    @JoinColumn(name = "thread_id")
    private Thread thread;

    @ManyToOne
    @JoinColumn(name = "parent_message_id")
    private Message parentMessage;

    @OneToMany(mappedBy = "message", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<Attachment> attachments = new HashSet<>();

    @OneToMany(mappedBy = "message", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<MessageReaction> reactions = new HashSet<>();

    @OneToMany(mappedBy = "message", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<MessageMention> mentions = new HashSet<>();
}


