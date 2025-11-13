export const fetchChannelMessages = async (channelId: number): Promise<any[]> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/channels/${channelId}/messages`,
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