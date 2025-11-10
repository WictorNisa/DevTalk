package com.devtalk.services;

import com.devtalk.dtos.groups.GroupResponseDTO;
import com.devtalk.exceptions.NoGroupsFoundException;
import com.devtalk.mappers.GroupMapper;
import com.devtalk.models.Group;
import com.devtalk.repositories.GroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroupService {

    public static final String DEFAULT_GROUP_NAME = "Default Group";

    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;

    @Transactional(readOnly = true)
    public GroupResponseDTO getDefaultGroup() {
        Group group = groupRepository.findByGroupnameWithMembers(DEFAULT_GROUP_NAME)
                .orElseGet(() -> groupRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new NoGroupsFoundException("No groups found in the system")));
        return groupMapper.toResponseDTO(group);
    }
}
