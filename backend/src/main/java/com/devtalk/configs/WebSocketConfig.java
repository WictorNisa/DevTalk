package com.devtalk.configs;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ObjectProvider<TaskScheduler> taskSchedulerProvider;

    public WebSocketConfig(ObjectProvider<TaskScheduler> taskSchedulerProvider) {
        this.taskSchedulerProvider = taskSchedulerProvider;
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .addInterceptors(new HttpSessionHandshakeInterceptor())
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
        var simpleBroker = registry.enableSimpleBroker("/topic", "/queue");
        TaskScheduler taskScheduler = taskSchedulerProvider.getIfAvailable();
        if (taskScheduler != null) {
            simpleBroker.setTaskScheduler(taskScheduler);
            // setHeartbeatValue([send interval, receive interval] in milliseconds)
            simpleBroker.setHeartbeatValue(new long[]{10000, 10000});
        } else {
            simpleBroker.setHeartbeatValue(new long[]{0, 0});
        }
    }
}
