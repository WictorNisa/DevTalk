package com.devtalk.configs;

import com.devtalk.services.OAuth2UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import static com.devtalk.configs.SecurityConstants.*;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final OAuth2UserService oAuth2UserService;
    private final CorsConfigurationSource corsConfigurationSource;
    private final org.springframework.security.web.authentication.logout.LogoutSuccessHandler logoutSuccessHandler;

    @Bean
    @Order(1)
    public SecurityFilterChain publicSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**", 
                                "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**", 
                                "/actuator/health")
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .sessionManagement(AbstractHttpConfigurer::disable)
                .securityContext(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable);

        log.info("Public security filter chain configured for Swagger/API docs");
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**", "/oauth2/**", "/login/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(OAUTH2_ENDPOINTS).permitAll()
                        .requestMatchers(API_PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/oauth2/authorization/github")
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .defaultSuccessUrl(OAUTH2_SUCCESS_URL, true)
                        .failureUrl(OAUTH2_FAILURE_URL))
                .logout(logout -> logout
                        .logoutUrl(LOGOUT_URL)
                        .logoutSuccessHandler(logoutSuccessHandler)
                        .deleteCookies(JSESSIONID_COOKIE)
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .permitAll())
                .httpBasic(basic -> basic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            log.warn("Authentication failed for URI: {}", request.getRequestURI());
                            response.sendRedirect("/oauth2/authorization/github");
                        }));

        log.info("API security filter chain configured");
        return http.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain webSocketSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/ws", "/ws/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()));

        log.info("WebSocket security filter chain configured");
        return http.build();
    }

    @Bean
    @Order(4)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin()));

        log.info("Default security filter chain configured (catch-all)");
        return http.build();
    }
}
