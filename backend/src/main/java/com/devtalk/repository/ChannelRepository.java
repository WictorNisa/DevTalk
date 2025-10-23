package com.devtalk.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devtalk.model.Channel;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

    @Query("select c from Channel c join fetch c.group where c.id = :id")
    Optional<Channel> findByIdWithGroup(@Param("id") Long id);

    @Query("select c from Channel c left join fetch c.messages m left join fetch m.user where c.id = :id")
    Optional<Channel> findByIdWithMessages(@Param("id") Long id);

    @Query("select c from Channel c left join fetch c.messages m left join fetch m.user u left join fetch m.attachments a left join fetch m.reactions r where c.id = :id")
    Optional<Channel> findByIdWithMessagesAndDetails(@Param("id") Long id);

    @Query("select c from Channel c left join fetch c.group g where c.group.id = :groupId")
    List<Channel> findByGroupIdWithGroup(@Param("groupId") Long groupId);

    @Query(value = "select c from Channel c left join fetch c.messages m left join fetch m.user where c.id = :id order by m.createdAt desc")
    Page<Channel> findByIdWithLatestMessages(@Param("id") Long id, Pageable pageable);
}


