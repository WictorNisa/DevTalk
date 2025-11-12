package com.devtalk.configs;

import com.devtalk.exceptions.NotFoundException;
import com.devtalk.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.transaction.TransactionException;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserActivityInterceptor implements HandlerInterceptor {

    private final UserService userService;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) {
        // Skip for non-API endpoints and OPTIONS requests
        if (!request.getRequestURI().startsWith("/api") || "OPTIONS".equals(request.getMethod())) {
            return true;
        }

        try {
            updateUserActivityIfAuthenticated();
        } catch (IllegalStateException | SecurityException e) {
            log.debug("Could not access security context for activity tracking: {}", e.getMessage());
        } catch (DataAccessException | TransactionException e) {
            log.warn("Database error updating user activity: {}", e.getMessage());
        }

        return true;
    }

    private void updateUserActivityIfAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
            return;
        }

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String externalId = extractExternalId(oauth2User);
        
        if (externalId != null) {
            userService.getUserByExternalId(externalId)
                    .ifPresent(user -> updateActivityForUser(user.getId(), externalId));
        }
    }

    private String extractExternalId(OAuth2User oauth2User) {
        String externalId = oauth2User.getAttribute("login");
        return externalId != null ? externalId : oauth2User.getName();
    }

    private void updateActivityForUser(Long userId, String externalId) {
        try {
            userService.updateLastActivityAt(userId);
        } catch (NotFoundException e) {
            log.debug("User {} not found when updating activity (may have been deleted): {}", externalId, e.getMessage());
        } catch (DataAccessException | TransactionException e) {
            log.warn("Failed to update last activity for user {}: {}", externalId, e.getMessage());
        }
    }
}

