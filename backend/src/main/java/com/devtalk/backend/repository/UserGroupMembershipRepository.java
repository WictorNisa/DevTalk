package com.devtalk.backend.repository;

import com.devtalk.backend.model.UserGroupMembership;
import com.devtalk.backend.enums.UserGroupMembershipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserGroupMembershipRepository extends JpaRepository<UserGroupMembership, Long> {

    @Query("select m from UserGroupMembership m join fetch m.user u join fetch m.group g where m.id = :id")
    Optional<UserGroupMembership> findByIdWithUserAndGroup(@Param("id") Long id);

    @Query("select m from UserGroupMembership m join fetch m.user u join fetch m.group g where m.user.id = :userId")
    List<UserGroupMembership> findByUserIdWithUserAndGroup(@Param("userId") Long userId);

    @Query("select m from UserGroupMembership m join fetch m.user u join fetch m.group g where m.group.id = :groupId")
    List<UserGroupMembership> findByGroupIdWithUserAndGroup(@Param("groupId") Long groupId);

    @Query("select m from UserGroupMembership m join fetch m.user u join fetch m.group g where m.user.id = :userId and m.group.id = :groupId")
    Optional<UserGroupMembership> findByUserIdAndGroupIdWithDetails(@Param("userId") Long userId, @Param("groupId") Long groupId);

    @Query("select m from UserGroupMembership m join fetch m.user u join fetch m.group g where m.type = :type")
    List<UserGroupMembership> findByTypeWithUserAndGroup(@Param("type") UserGroupMembershipType type);
}
