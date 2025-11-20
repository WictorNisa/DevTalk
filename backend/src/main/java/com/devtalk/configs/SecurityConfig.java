package com.devtalk.configs;

import com.devtalk.services.OAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Create list of allowed origins, always including localhost for development
        List<String> allowedOrigins = new ArrayList<>();
        allowedOrigins.add("http://localhost:5173");
        allowedOrigins.add("http://localhost:8080");
        allowedOrigins.add("http://localhost:63342");

        // Add production frontend URL if configured
        if (frontendUrl != null && !frontendUrl.equals("http://localhost:5173")) {
            allowedOrigins.add(frontendUrl);
        }

        corsConfiguration.setAllowedOrigins(allowedOrigins);
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowedMethods(List.of("*"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource url = new UrlBasedCorsConfigurationSource();
        url.registerCorsConfiguration("/**", corsConfiguration);
        return url;
    }

    // Temporarily disabling security config for development purposes
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OAuth2UserService oAuth2UserService) throws Exception {
        http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .httpBasic(basic -> basic.disable())
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .defaultSuccessUrl(frontendUrl + "/dashboard", true)
                        .failureUrl(frontendUrl + "/error"))
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
        http.headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin()));
        return http.build();
    }
}
