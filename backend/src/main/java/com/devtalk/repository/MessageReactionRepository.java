package com.devtalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devtalk.model.MessageReaction;
import com.devtalk.enums.MessageReactionType;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {

    @Query("select r from MessageReaction r join fetch r.message m join fetch m.user where r.id = :id")
    Optional<MessageReaction> findByIdWithMessageAndUser(@Param("id") Long id);

    @Query("select r from MessageReaction r join fetch r.message m where r.message.id = :messageId")
    List<MessageReaction> findByMessageIdWithMessage(@Param("messageId") Long messageId);

    @Query("select r from MessageReaction r join fetch r.message m join fetch m.user u join fetch m.channel c where r.message.id = :messageId")
    List<MessageReaction> findByMessageIdWithFullContext(@Param("messageId") Long messageId);

    @Query("select r from MessageReaction r join fetch r.message m where r.reactionType = :reactionType")
    List<MessageReaction> findByReactionTypeWithMessage(@Param("reactionType") MessageReactionType reactionType);
}
