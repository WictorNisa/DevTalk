package com.devtalk.repository;

import com.devtalk.model.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {

    @Query("select t from Thread t join fetch t.originalMessage om join fetch om.user join fetch t.channel where t.id = :id")
    Optional<Thread> findByIdWithDetails(@Param("id") Long id);

    @Query("select t from Thread t join fetch t.originalMessage om join fetch om.user join fetch t.channel " +
           "left join fetch t.messages m left join fetch m.user where t.id = :id")
    Optional<Thread> findByIdWithMessages(@Param("id") Long id);

    @Query("select t from Thread t join fetch t.originalMessage om join fetch om.user join fetch t.channel " +
           "where t.channel.id = :channelId order by t.createdAt desc")
    List<Thread> findByChannelId(@Param("channelId") Long channelId);

    @Query("select t from Thread t join fetch t.originalMessage where t.originalMessage.id = :messageId")
    Optional<Thread> findByOriginalMessageId(@Param("messageId") Long messageId);
}

