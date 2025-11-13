package com.devtalk.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final UserActivityInterceptor userActivityInterceptor;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(userActivityInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/logout",
                        "/api/me", 
                        "/api-docs/**",
                        "/swagger-ui/**",
                        "/oauth2/**" 
                );
    }
}

