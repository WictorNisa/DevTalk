package com.devtalk.backend.repository;

import com.devtalk.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("select g from Group g left join fetch g.channels where g.id = :id")
    Optional<Group> findByIdWithChannels(@Param("id") Long id);

    @Query("select g from Group g left join fetch g.memberships m left join fetch m.user where g.id = :id")
    Optional<Group> findByIdWithMembers(@Param("id") Long id);

    @Query("select g from Group g left join fetch g.memberships m left join fetch m.user u left join fetch g.channels c where g.id = :id")
    Optional<Group> findByIdWithMembersAndChannels(@Param("id") Long id);

    @Query("select g from Group g left join fetch g.memberships m left join fetch m.user where g.groupname = :groupname")
    Optional<Group> findByGroupnameWithMembers(@Param("groupname") String groupname);

    @Query("select g from Group g left join fetch g.channels c left join fetch c.messages m left join fetch m.user where g.id = :id")
    Optional<Group> findByIdWithChannelsAndMessages(@Param("id") Long id);
}


