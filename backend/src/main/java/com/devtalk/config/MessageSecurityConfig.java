//package com.devtalk.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.simp.SimpMessageType;
//import org.springframework.security.authorization.AuthorizationManager;
//import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
//import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
//
//@Configuration
//@EnableWebSocketSecurity
//public class MessageSecurityConfig {
//
//    @Bean
//    AuthorizationManager<Message<?>> messageAuthorizationManager
//            (MessageMatcherDelegatingAuthorizationManager.Builder messages){
//        messages.simpTypeMatchers(SimpMessageType.CONNECT,
//                SimpMessageType.SUBSCRIBE,
//                SimpMessageType.MESSAGE,
//                SimpMessageType.UNSUBSCRIBE)
//                .permitAll()
//                .simpDestMatchers("/app/**").permitAll()
//                .simpSubscribeDestMatchers("/topic/**", "/queue/**", "/user/**")
//                .permitAll()
//                .anyMessage().permitAll();
//
//        return messages.build();
//    }
//}
