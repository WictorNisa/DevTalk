package com.devtalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devtalk.model.Attachment;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    @Query("select a from Attachment a join fetch a.message m join fetch m.user where a.id = :id")
    Optional<Attachment> findByIdWithMessageAndUser(@Param("id") Long id);

    @Query("select a from Attachment a join fetch a.message m where a.message.id = :messageId")
    List<Attachment> findByMessageIdWithMessage(@Param("messageId") Long messageId);

    @Query("select a from Attachment a join fetch a.message m join fetch m.user u join fetch m.channel c where a.message.id = :messageId")
    List<Attachment> findByMessageIdWithFullContext(@Param("messageId") Long messageId);
}
