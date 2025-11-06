package com.devtalk.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devtalk.models.Message;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("select m from Message m join fetch m.user join fetch m.channel where m.id = :id")
    Optional<Message> findByIdWithAuthorAndChannel(@Param("id") Long id);

    @Query("select m from Message m join fetch m.user u join fetch m.channel c left join fetch m.attachments a left join fetch m.reactions r left join fetch r.user left join fetch m.mentions men left join fetch men.mentionedUser where m.id = :id")
    Optional<Message> findByIdWithAllDetails(@Param("id") Long id);

    @Query(value = "select distinct m from Message m join fetch m.user u left join fetch m.attachments a left join fetch m.reactions r left join fetch r.user left join fetch m.mentions men left join fetch men.mentionedUser where m.channel.id = :channelId order by m.createdAt desc")
    Page<Message> findLatestByChannel(@Param("channelId") Long channelId, Pageable pageable);

    @Query(value = "select distinct m from Message m join fetch m.user u left join fetch m.attachments a left join fetch m.reactions r left join fetch r.user left join fetch m.mentions men left join fetch men.mentionedUser where m.channel.id = :channelId and m.createdAt < :before order by m.createdAt desc")
    Page<Message> findByChannelIdAndCreatedAtBefore(@Param("channelId") Long channelId, @Param("before") Instant before, Pageable pageable);

    @Query("select distinct m from Message m join fetch m.user u join fetch m.channel c left join fetch m.attachments a left join fetch m.reactions r left join fetch r.user left join fetch m.mentions men left join fetch men.mentionedUser where m.channel.id = :channelId order by m.createdAt desc")
    List<Message> findByChannelIdWithAuthorAndChannel(@Param("channelId") Long channelId);

    @Query("select m from Message m join fetch m.user u join fetch m.channel c left join fetch m.attachments a where m.channel.id = :channelId order by m.createdAt desc")
    List<Message> findByChannelIdWithAttachments(@Param("channelId") Long channelId);

    @Query("select m from Message m join fetch m.user u where m.user.id = :userId order by m.createdAt desc")
    List<Message> findByUserIdWithUser(@Param("userId") Long userId);

    @Query("select count(m) from Message m where m.parentMessage.id = :messageId")
    Long countRepliesByMessageId(@Param("messageId") Long messageId);

    @Query("select m.parentMessage.id, count(m) from Message m where m.parentMessage.id in :messageIds group by m.parentMessage.id")
    List<Object[]> findReplyCountsByMessageIds(@Param("messageIds") List<Long> messageIds);

    @Query("select distinct m from Message m join fetch m.user u left join fetch m.attachments a " +
           "left join fetch m.reactions r left join fetch r.user left join fetch m.mentions men left join fetch men.mentionedUser " +
           "where m.parentMessage.id = :parentMessageId order by m.createdAt asc")
    List<Message> findByParentMessageId(@Param("parentMessageId") Long parentMessageId);

    @Query("select distinct m from Message m join fetch m.user u left join fetch m.attachments a " +
           "left join fetch m.reactions r left join fetch r.user left join fetch m.mentions men left join fetch men.mentionedUser " +
           "where m.thread.id = :threadId order by m.createdAt asc")
    List<Message> findByThreadId(@Param("threadId") Long threadId);

    List<Message> findByContentContainingIgnoreCase(String query);
}


