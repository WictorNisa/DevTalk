package com.devtalk.services;

import com.devtalk.models.User;
import com.devtalk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserActivityService {

    private final UserService userService;
    private final UserRepository userRepository;

    @Transactional
    public void updateLastActivityAt(Long userId) {
        User user = userService.getUserById(userId);
        user.setLastActivityAt(Instant.now());
        userRepository.save(user);
        log.debug("Updated last activity timestamp for user {}", userId);
    }
}

