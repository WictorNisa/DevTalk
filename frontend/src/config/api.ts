/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth
    LOGOUT: `${API_BASE_URL}/api/logout`,
    CURRENT_USER: `${API_BASE_URL}/api/me`,

    // Users
    USERS: `${API_BASE_URL}/api/users`,

    // Channels
    CHANNELS: `${API_BASE_URL}/api/channels`,
    CHANNEL_MESSAGES: (channelId: string) => `${API_BASE_URL}/api/channels/${channelId}/messages`,

    // WebSocket
    WS: `${API_BASE_URL}/ws`,
  },
};

export default API_CONFIG;
