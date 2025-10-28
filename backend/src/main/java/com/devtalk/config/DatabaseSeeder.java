package com.devtalk.config;

import com.devtalk.enums.Role;
import com.devtalk.model.Channel;
import com.devtalk.model.Group;
import com.devtalk.model.Message;
import com.devtalk.model.User;
import com.devtalk.repository.ChannelRepository;
import com.devtalk.repository.GroupRepository;
import com.devtalk.repository.MessageRepository;
import com.devtalk.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @Override
    public void run(String... args) {
        seedDefaultGroupAndChannel();
        seedDefaultUsersAndMessages();
    }

    private void seedDefaultUsersAndMessages() {
        log.info("Seeding default users...");
        long userCount = userRepository.count();
        if (userCount > 0) {
            log.info("Database already has {} user(s), skipping user seed", userCount);
            return;
        }

        User systemUser = User.builder()
                .displayName("System")
                .role(Role.ADMIN)
                .externalId("system-0")
                .build();
        systemUser = userRepository.save(systemUser);
        log.info("Created system user: {} (ID: {})", systemUser.getDisplayName(), systemUser.getId());

        User defaultUser = User.builder()
                .displayName("Default User")
                .role(Role.ADMIN)
                .externalId("default-0")
                .build();
        defaultUser = userRepository.save(defaultUser);
        log.info("Created default user: {} (ID: {})", defaultUser.getDisplayName(), defaultUser.getId());

        Channel generalChannel = channelRepository.findAll().stream()
                .filter(c -> "general".equals(c.getName()))
                .findFirst()
                .orElse(null);

        Channel frontendChannel = channelRepository.findAll().stream()
                .filter(c -> "frontend".equals(c.getName()))
                .findFirst()
                .orElse(null);

        Channel backendChannel = channelRepository.findAll().stream()
                .filter(c -> "backend".equals(c.getName()))
                .findFirst()
                .orElse(null);

        if (generalChannel != null) {
            Message welcomeMessage = Message.builder()
                    .content("Welcome to DevTalk! This is the general channel.")
                    .user(defaultUser)
                    .channel(generalChannel)
                    .build();
            messageRepository.save(welcomeMessage);
            log.info("Created welcome message in general channel");
        }

        if (frontendChannel != null) {
            Message frontendMessage = Message.builder()
                    .content("Frontend discussions go here. Share your React and Next.js tips!")
                    .user(defaultUser)
                    .channel(frontendChannel)
                    .build();
            messageRepository.save(frontendMessage);
            log.info("Created message in frontend channel");
        }

        if (backendChannel != null) {
            Message backendMessage = Message.builder()
                    .content("Backend discussions go here. Talk about Spring Boot, APIs, and databases!")
                    .user(defaultUser)
                    .channel(backendChannel)
                    .build();
            messageRepository.save(backendMessage);
            log.info("Created message in backend channel");
        }

        log.info("User and message seeding completed successfully!");

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

