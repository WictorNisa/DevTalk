package com.devtalk.services;

import com.devtalk.dtos.user.UpdateUserStatusRequest;
import com.devtalk.dtos.user.UserResponseDTO;
import com.devtalk.dtos.user.UserStatusDTO;
import com.devtalk.enums.PresenceStatus;
import com.devtalk.mappers.UserMapper;
import com.devtalk.models.User;
import com.devtalk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatusService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserService userService;

    @Transactional
    public void updatePresenceStatus(Long userId, PresenceStatus status) {
        User user = userService.getUserById(userId);
        user.setPresenceStatus(status);
        userRepository.save(user);
        log.info("Updated user {} presence to {}", userId, status);
    }

    @Transactional
    public UserStatusDTO updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = userService.getUserById(userId);
        updateUserStatusFields(user, request);
        User updated = userRepository.save(user);
        log.info("Updated user {} status to {} with custom message: {}", userId, request.getStatus(), request.getCustomStatusMessage());
        return userMapper.toStatusDTO(updated);
    }

    private void updateUserStatusFields(User user, UpdateUserStatusRequest request) {
        user.setPresenceStatus(request.getStatus());
        user.setCustomStatusMessage(request.getCustomStatusMessage());
    }

    @Transactional(readOnly = true)
   public List<UserResponseDTO> getUsersByPresenceStatus(PresenceStatus status) {
    log.debug("Fetching users with presence status: {}", status);
    return userRepository.findByPresenceStatus(status)
        .stream()
        .map(userMapper::toResponseDTO)
        .collect(Collectors.toList());
}
}

