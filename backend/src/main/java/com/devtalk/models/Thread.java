package com.devtalk.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "threads", indexes = {
    @Index(name = "idx_thread_channel", columnList = "channel_id"),
    @Index(name = "idx_thread_created", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class Thread extends BaseEntity {

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "original_message_id", nullable = false)
    private Message originalMessage;

    @OneToMany(mappedBy = "thread", 
               cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE}, 
               orphanRemoval = true)
    @Builder.Default
    private Set<Message> messages = new HashSet<>();
}
