package com.devtalk.config;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.config.Task;
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
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .addInterceptors(new HttpSessionHandshakeInterceptor())
                .setAllowedOrigins("http://localhost:5173", "http://localhost:8080", "http://localhost:63342")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        var simpleBroker = registry.enableSimpleBroker("/topic", "/queue");
        TaskScheduler taskScheduler = taskSchedulerProvider.getIfAvailable();
        if (taskScheduler != null) {
            simpleBroker.setTaskScheduler(taskScheduler);
            simpleBroker.setHeartbeatValue(new long[]{10000, 10000});
        } else {
            simpleBroker.setHeartbeatValue(new long[]{0, 0});
        }
    }
}
