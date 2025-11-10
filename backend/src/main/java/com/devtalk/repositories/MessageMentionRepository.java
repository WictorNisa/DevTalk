package com.devtalk.repositories;

import com.devtalk.models.MessageMention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageMentionRepository extends JpaRepository<MessageMention, Long> {

    @Query("select m from MessageMention m join fetch m.mentionedUser where m.message.id = :messageId")
    List<MessageMention> findByMessageId(@Param("messageId") Long messageId);

    @Query("select m from MessageMention m join fetch m.message where m.mentionedUser.id = :userId order by m.createdAt desc")
    List<MessageMention> findByMentionedUserId(@Param("userId") Long userId);

    Optional<MessageMention> findByMessageIdAndMentionedUserId(Long messageId, Long mentionedUserId);

    @Query("select count(m) from MessageMention m where m.mentionedUser.id = :userId and m.message.channel.id = :channelId")
    Long countUnreadMentionsInChannel(@Param("userId") Long userId, @Param("channelId") Long channelId);
}

