package com.devtalk.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "message_mentions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"message_id", "mentioned_user_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class MessageMention extends BaseEntity {

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "mentioned_user_id", nullable = false)
    private User mentionedUser;

    @Column(name = "start_position")
    private Integer startPosition; // Position in content where @username starts

    @Column(name = "end_position")
    private Integer endPosition; // Position in content where @username ends
}

