package com.devtalk.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // Temporarily disabling security config for development purposes
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .oauth2Login(Customizer.withDefaults())
                .cors(Customizer.withDefaults())
                .csrf(Customizer.withDefaults())
                .httpBasic(basic -> basic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.logoutUrl("/logout")
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(HttpServletResponse.SC_NO_CONTENT)));
        return http.build();
    }
}
