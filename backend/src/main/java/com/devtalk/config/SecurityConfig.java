package com.devtalk.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080", "http://localhost:63342"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowedMethods(List.of("*"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource url = new UrlBasedCorsConfigurationSource();
        url.registerCorsConfiguration("/**", corsConfiguration);
        return url;
    }

    // Temporarily disabling security config for development purposes
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .httpBasic(basic -> basic.disable())
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:5173/dashboard", true)
                        .failureUrl("http://localhost:5173/error"))
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.logoutUrl("/api/logout")
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .permitAll()
                        .logoutSuccessHandler((req, res, auth) -> {
                            res.setStatus(HttpServletResponse.SC_OK);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"message\":\"Logout successful\"}");
                        }));
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));
        return http.build();
    }
}
