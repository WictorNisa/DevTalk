package com.devtalk.repository;

import com.devtalk.enums.UserGroupMembershipType;
import com.devtalk.model.UserGroupMembership;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
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
