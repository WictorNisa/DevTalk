package com.devtalk.config;

import com.devtalk.model.Channel;
import com.devtalk.model.Group;
import com.devtalk.repository.ChannelRepository;
import com.devtalk.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ChannelRepository channelRepository;
    private final GroupRepository groupRepository;

    @Override
    public void run(String... args) {
        seedDefaultGroupAndChannel();
    }

    private void seedDefaultGroupAndChannel() {
        long channelCount = channelRepository.count();
        if (channelCount > 0) {
            log.info("Database already has {} channel(s), skipping seed", channelCount);
            return;
        }

        log.info("Seeding default group and channel...");
        Group defaultGroup = Group.builder()
                .groupName("Default Group")
                .build();
        defaultGroup = groupRepository.save(defaultGroup);
        log.info("Created default group: {}", defaultGroup.getGroupName());

        Channel generalChannel = Channel.builder()
                .name("general")
                .group(defaultGroup)
                .build();
        generalChannel = channelRepository.save(generalChannel);
        log.info("Created default channel: {} (ID: {})", generalChannel.getName(), generalChannel.getId());

        Channel frontendChannel = Channel.builder()
                .name("frontend")
                .group(defaultGroup)
                .build();
        frontendChannel = channelRepository.save(frontendChannel);
        log.info("Created channel: {} (ID: {})", frontendChannel.getName(), frontendChannel.getId());

        Channel backendChannel = Channel.builder()
                .name("backend")
                .group(defaultGroup)
                .build();
        backendChannel = channelRepository.save(backendChannel);
        log.info("Created channel: {} (ID: {})", backendChannel.getName(), backendChannel.getId());

        log.info("Database seeding completed successfully!");
    }
}

