package com.devtalk.configs;

public final class SecurityConstants {

    private SecurityConstants() {
        throw new UnsupportedOperationException("Utility class");
    }

    private static final String FRONTEND_URL = System.getenv("FRONTEND_URL") != null
            ? System.getenv("FRONTEND_URL")
            : "http://localhost:5173";

    public static final String[] PUBLIC_ENDPOINTS = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-ui/index.html",
            "/api-docs",
            "/api-docs/**",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**",
            "/actuator/health"
    };

    public static final String[] OAUTH2_ENDPOINTS = {
            "/login/oauth2/code/**",
            "/oauth2/**"
    };

    public static final String[] API_PUBLIC_ENDPOINTS = {
            "/api/logout"
    };

    public static final String LOGOUT_URL = "/api/logout";
    public static final String LOGOUT_SUCCESS_MESSAGE = "{\"message\":\"Logout successful\"}";
    public static final String JSESSIONID_COOKIE = "JSESSIONID";

    public static final String[] ALLOWED_ORIGINS = getAllowedOrigins();

    private static String[] getAllowedOrigins() {
        String profile = System.getenv("SPRING_PROFILES_ACTIVE");
        if ("prod".equals(profile) || "production".equals(profile)) {
            // Production: only allow the configured frontend URL
            return new String[]{FRONTEND_URL};
        }
        // Development: allow localhost URLs
        return new String[]{
                FRONTEND_URL,
                "http://localhost:5173",
                "http://localhost:8080",
                "http://localhost:63342"
        };
    }

    public static final String OAUTH2_SUCCESS_URL = FRONTEND_URL + "/dashboard";
    public static final String OAUTH2_FAILURE_URL = FRONTEND_URL + "/error";
}

