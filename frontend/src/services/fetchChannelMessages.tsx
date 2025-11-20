export interface ChannelMessage {
  id: number;
  content: string;
  author: string;
  timestamp: string; // or Date, depending on API
}

import API_CONFIG from "@/config/api";

export const fetchChannelMessages = async (channelId: number): Promise<ChannelMessage[]> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.CHANNEL_MESSAGES(channelId.toString()),
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    const data = await response.json();
    return data.messages || []; 
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};