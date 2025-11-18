package com.devtalk.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import static com.devtalk.configs.SecurityConstants.LOGOUT_SUCCESS_MESSAGE;

@Configuration
public class LogoutHandlerConfig {

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> {
            response.setStatus(HttpStatus.OK.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(LOGOUT_SUCCESS_MESSAGE);
        };
    }
}


