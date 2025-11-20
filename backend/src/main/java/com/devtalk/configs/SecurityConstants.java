package com.devtalk.configs;

public final class SecurityConstants {

    private SecurityConstants() {
        throw new UnsupportedOperationException("Utility class");
    }

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

    public static final String[] ALLOWED_ORIGINS = {
            "http://localhost:5173",
            "http://localhost:8080",
            "http://localhost:63342"
    };

    public static final String OAUTH2_SUCCESS_URL = "http://localhost:5173/dashboard";
    public static final String OAUTH2_FAILURE_URL = "http://localhost:5173/error";
}

