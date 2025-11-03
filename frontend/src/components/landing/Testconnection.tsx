import SockJs from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
}

const Testconnection = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const connect = () => {
    //This creates a SockJs connection
    const socket = new SockJs("http://localhost:8080/ws");

    //Create a STOMP client
    const client = new Client({
      webSocketFactory: () => socket,

      onConnect: () => {
        console.log("Connected to websocket");
        setConnected(true);

        //Sub to messages topic
        client.subscribe("/topic/room/1", (message) => {
          console.log("Received:", message.body);
          setMessages((prev) => [...prev, message.body]);
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        setConnected(false);
      },
      onWebSocketClose: () => {
        console.log("Websocket connection closed");
        setConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("Websocket error:", error);
      },
    });
    client.activate();
    setStompClient(client);
  };

  const disconnect = () => {
    if (stompClient && connected) {
      stompClient.deactivate();
      setStompClient(null);
      setConnected(false);
      console.log("Disconnected from websocket");
    }
  };

  const sendMessage = (messageContent: string) => {
    if (stompClient && connected) {
      const payload = {
        content: messageContent,
        userId: 1,
        channelId: 1,
        threadId: null,
        parentMessageId: null,
        destination: `/topic/room/1`
      };
      stompClient.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
    }
  };

  const sendPing = () => {
    if (stompClient && connected) {
      const payload = {
        content: null,
        userId: 1,
        channelId: 1,
        threadId: null,
        parentMessageId: null,
      };

      stompClient.publish({
        destination: "/app/ping",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={connect}
          disabled={connected}
          className="mr-2 rounded bg-green-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={!connected}
          className="rounded bg-red-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Disconnect
        </button>
        <span
          className={`ml-4 rounded px-2 py-1 text-sm ${
            connected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>
        <button
          onClick={sendPing}
          disabled={!connected}
          className="mr-2 rounded bg-yellow-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Send Ping
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter message..."
          className="mr-2 rounded border px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              sendMessage(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.querySelector("input") as HTMLInputElement;
            if (input?.value.trim()) {
              sendMessage(input.value);
              input.value = "";
            }
          }}
          disabled={!connected}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>

      <div className="h-64 overflow-y-auto rounded border p-4">
        <h3 className="mb-2 font-bold">Messages:</h3>
        {messages.map((message, index) => (
          <div key={index} className="mb-2 rounded bg-blue-300 text-amber-800 p-2">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testconnection;
