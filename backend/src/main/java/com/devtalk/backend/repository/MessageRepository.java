package com.devtalk.backend.repository;

import com.devtalk.backend.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("select m from Message m join fetch m.user join fetch m.channel where m.id = :id")
    Optional<Message> findByIdWithAuthorAndChannel(@Param("id") Long id);

    @Query("select m from Message m join fetch m.user u join fetch m.channel c left join fetch m.attachments a left join fetch m.reactions r where m.id = :id")
    Optional<Message> findByIdWithAllDetails(@Param("id") Long id);

    @Query(value = "select m from Message m join fetch m.user where m.channel.id = :channelId order by m.createdAt desc")
    Page<Message> findLatestByChannel(@Param("channelId") Long channelId, Pageable pageable);

    @Query("select m from Message m join fetch m.user u join fetch m.channel c where m.channel.id = :channelId order by m.createdAt desc")
    List<Message> findByChannelIdWithAuthorAndChannel(@Param("channelId") Long channelId);

    @Query("select m from Message m join fetch m.user u join fetch m.channel c left join fetch m.attachments a where m.channel.id = :channelId order by m.createdAt desc")
    List<Message> findByChannelIdWithAttachments(@Param("channelId") Long channelId);

    @Query("select m from Message m join fetch m.user u where m.user.id = :userId order by m.createdAt desc")
    List<Message> findByUserIdWithUser(@Param("userId") Long userId);
}


