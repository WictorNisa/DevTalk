package com.devtalk.service;

import com.devtalk.dto.base.GroupBaseDTO;
import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.groups.GroupResponseDTO;
import com.devtalk.mappers.GroupMapper;
import com.devtalk.mappers.MessageMapper;
import com.devtalk.model.Group;
import com.devtalk.repository.ChannelRepository;
import com.devtalk.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
                        .orElseThrow(() -> new RuntimeException("No groups found in the system")));
        return groupMapper.toResponseDTO(group);
    }

}
