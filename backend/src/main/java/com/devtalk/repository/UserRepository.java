package com.devtalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devtalk.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByExternalId(String externalId);

    @Query("select u from User u left join fetch u.groupMemberships gm left join fetch gm.group where u.id = :id")
    Optional<User> findByIdWithGroups(@Param("id") Long id);

    @Query("select u from User u left join fetch u.groupMemberships where u.externalId = :externalId")
    Optional<User> findByExternalIdWithMemberships(@Param("externalId") String externalId);

    @Query("select u from User u left join fetch u.groupMemberships gm left join fetch gm.group g left join fetch g.channels where u.id = :id")
    Optional<User> findByIdWithGroupsAndChannels(@Param("id") Long id);

    @Query("select u from User u where u.presenceStatus = :status")
    List<User> findByPresenceStatus(@Param("status") com.devtalk.enums.PresenceStatus status);

    Optional<User> findByDisplayNameIgnoreCase(String displayName);
}


