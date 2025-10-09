package com.devtalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devtalk.model.MessageReaction;

import java.util.List;
import java.util.Optional;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {

    @Query("select r from MessageReaction r join fetch r.message m join fetch m.user where r.id = :id")
    Optional<MessageReaction> findByIdWithMessageAndUser(@Param("id") Long id);

    @Query("select r from MessageReaction r join fetch r.message m where r.message.id = :messageId")
    List<MessageReaction> findByMessageIdWithMessage(@Param("messageId") Long messageId);

    @Query("select r from MessageReaction r join fetch r.message m join fetch m.user u join fetch m.channel c where r.message.id = :messageId")
    List<MessageReaction> findByMessageIdWithFullContext(@Param("messageId") Long messageId);

    @Query("select r from MessageReaction r join fetch r.message m where r.emoji = :emoji")
    List<MessageReaction> findByEmojiWithMessage(@Param("emoji") String emoji);
}
