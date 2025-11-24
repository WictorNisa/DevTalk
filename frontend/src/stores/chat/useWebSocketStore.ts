import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "@/config/api";

interface WebSocketState {
    // State
    stompClient: Client | null;
    connected: boolean;

    // Actions
    connect: () => void;
    disconnect: () => void;
    getClient: () => Client | null;
    isConnected: () => boolean;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
    // Initial state
    stompClient: null,
    connected: false,

    // Actions
    connect: () => {
        console.log("Attempting to connect to websocket...");

        const socket = new SockJS(`${API_BASE_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log("[STOMP Debug]", str),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
        });

        client.onConnect = () => {
            console.log("STOMP connected successfully!");
            set({ connected: true });
        };

        client.onStompError = (frame) => {
            console.error("STOMP error:", frame);
            set({ connected: false });
        };

        client.activate();
        set({ stompClient: client });
    },

    disconnect: () => {
        const { stompClient } = get();
        if (stompClient) {
            stompClient.deactivate();
            set({ stompClient: null, connected: false });
        }
    },

    getClient: () => get().stompClient,

    isConnected: () => get().connected,
}));
