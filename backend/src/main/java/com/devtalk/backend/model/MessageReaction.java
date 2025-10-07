package com.devtalk.backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "message_reactions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"message_id", "user_id", "emoji"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class MessageReaction extends BaseEntity {

    @NotBlank
    @Size(max = 10)
    @Column(nullable = false, length = 10)
    private String emoji;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}


