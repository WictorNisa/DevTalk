package com.devtalk.service;

import com.devtalk.dto.user.UpdateUserRequest;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.mappers.UserMapper;
import com.devtalk.model.User;
import com.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional
    public UserResponseDTO createOrGetUser(String externalId, String displayName) {
        Optional<User> existingUser = userRepository.findByExternalId(externalId);
        if (existingUser.isPresent()) {
            log.info("User found: {} ({})", displayName, externalId);
            return userMapper.toResponseDTO(existingUser.get());
        }

        User newUser = User.builder()
                .externalId(externalId)
                .displayName(displayName)
                .presenceStatus(PresenceStatus.ONLINE)
                .build();

        User saved = userRepository.save(newUser);
        log.info("Created new user: {} ({})", displayName, externalId);
        return userMapper.toResponseDTO(saved);
    }


    //Internal use
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserDTOById(Long userId) {
        User user = getUserById(userId);
        return userMapper.toResponseDTO(user);
    }

    @Transactional
    public void updatePresenceStatus(Long userId, PresenceStatus status) {
        User user = getUserById(userId);
        user.setPresenceStatus(status);
        userRepository.save(user);
        log.info("Updated user {} presence to {}", userId, status);
    }


    @Transactional(readOnly = true)
    public List<UserResponseDTO> getUsersByPresenceStatus(PresenceStatus status) {
        return userRepository.findByPresenceStatus(status).stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UpdateUserRequest request) {
        User user = getUserById(id);
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getLanguage() != null) {
            user.setLanguage(request.getLanguage());
        }
        if (request.getTheme() != null) {
            user.setTheme(request.getTheme());
        }
        User updated = userRepository.save(user);
        log.info("Updated user {}", id);
        return userMapper.toResponseDTO(updated);
    }
}
