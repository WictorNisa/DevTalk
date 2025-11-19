package com.devtalk.configs;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:DevTalk API}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title(applicationName)
                        .version("1.0.0")
                        .description("API documentation for DevTalk application. " +
                                "WebSocket endpoints use STOMP protocol over SockJS. " +
                                "Connect to /ws and send messages to /app/* destinations.")
                        .contact(new Contact()
                                .name("DevTalk Team")
                                .email("support@devtalk.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local development server")
                ));

        // Add WebSocket connection endpoint
        addWebSocketEndpoints(openAPI);

        return openAPI;
    }

    private void addWebSocketEndpoints(OpenAPI openAPI) {
        // WebSocket connection endpoint
        PathItem wsPath = new PathItem()
                .get(new Operation()
                        .summary("WebSocket Connection")
                        .description("Connect to WebSocket server using STOMP over SockJS. " +
                                "After connection, subscribe to topics and send messages to /app/* destinations.")
                        .operationId("websocketConnect")
                        .responses(new ApiResponses()
                                .addApiResponse("101", new ApiResponse()
                                        .description("Switching Protocols - WebSocket connection established")
                                        .content(new Content()
                                                .addMediaType("application/json", new MediaType()
                                                        .example("WebSocket connection successful"))))
                                .addApiResponse("400", new ApiResponse()
                                        .description("Bad Request - Invalid WebSocket handshake"))
                                .addApiResponse("403", new ApiResponse()
                                        .description("Forbidden - Authentication required"))));
        openAPI.path("/ws", wsPath);

        // Document WebSocket message mappings as informational paths
        // Chat message endpoints
        openAPI.path("/app/chat.send", createWebSocketMessagePath(
                "Send Chat Message",
                "Send a chat message to a channel. Destination: /app/chat.send",
                "ChatMessageDTO"));
        
        openAPI.path("/app/chat.edit", createWebSocketMessagePath(
                "Edit Chat Message",
                "Edit an existing message. Destination: /app/chat.edit",
                "MessageEditDTO"));
        
        openAPI.path("/app/chat.delete", createWebSocketMessagePath(
                "Delete Chat Message",
                "Delete a message. Destination: /app/chat.delete",
                "MessageDeleteDTO"));
        
        openAPI.path("/app/ping", createWebSocketMessagePath(
                "Ping",
                "Send a ping message. Responds on /topic/pong. Destination: /app/ping",
                "MessageBaseDTO"));
        
        openAPI.path("/app/message.react", createWebSocketMessagePath(
                "Add Reaction",
                "Add a reaction to a message. Destination: /app/message.react",
                "MessageReactionDTO"));
        
        openAPI.path("/app/message.unreact", createWebSocketMessagePath(
                "Remove Reaction",
                "Remove a reaction from a message. Destination: /app/message.unreact",
                "MessageReactionDTO"));
        
        openAPI.path("/app/message.attach", createWebSocketMessagePath(
                "Attach File",
                "Attach a file to a message. Destination: /app/message.attach",
                "AttachmentDTO"));
        
        openAPI.path("/app/typing.start", createWebSocketMessagePath(
                "Typing Start",
                "Broadcast typing start event. Destination: /app/typing.start",
                "TypingDTO"));
        
        openAPI.path("/app/typing.stop", createWebSocketMessagePath(
                "Typing Stop",
                "Broadcast typing stop event. Destination: /app/typing.stop",
                "TypingDTO"));
        
        openAPI.path("/app/message.read", createWebSocketMessagePath(
                "Read Receipt",
                "Send read receipt. Destination: /app/message.read",
                "ReadReceiptDTO"));
        
        openAPI.path("/app/message.history", createWebSocketMessagePath(
                "Get Message History",
                "Request message history. Response on /user/queue/history. Destination: /app/message.history",
                "MessageBaseDTO"));
        
        openAPI.path("/app/thread.replies", createWebSocketMessagePath(
                "Get Thread Replies",
                "Get all replies for a parent message. Destination: /app/thread.replies",
                "MessageBaseDTO"));
        
        openAPI.path("/app/thread.messages", createWebSocketMessagePath(
                "Get Thread Messages",
                "Get all messages in a thread. Destination: /app/thread.messages",
                "MessageBaseDTO"));
        
        openAPI.path("/app/thread.list", createWebSocketMessagePath(
                "Get Channel Threads",
                "Get all threads in a channel. Destination: /app/thread.list",
                "MessageBaseDTO"));
        
        openAPI.path("/app/message.search", createWebSocketMessagePath(
                "Search Messages",
                "Search for messages. Destination: /app/message.search",
                "MessageBaseDTO"));
        
        openAPI.path("/app/message.get", createWebSocketMessagePath(
                "Get Message by ID",
                "Get a single message by ID. Destination: /app/message.get",
                "MessageBaseDTO"));
        
        openAPI.path("/app/message.read.bulk", createWebSocketMessagePath(
                "Bulk Read Receipts",
                "Mark multiple messages as read. Destination: /app/message.read.bulk",
                "ReadReceiptDTO"));
        
        openAPI.path("/app/mentions.list", createWebSocketMessagePath(
                "Get User Mentions",
                "Get all messages where user was mentioned. Destination: /app/mentions.list",
                "MessageBaseDTO"));
        
        openAPI.path("/app/ping.latency", createWebSocketMessagePath(
                "Latency Test",
                "Measure round-trip latency. Responds on /topic/latency-pong. Destination: /app/ping.latency",
                "MessageBaseDTO"));
    }

    private PathItem createWebSocketMessagePath(String summary, String description, String requestBodyType) {
        return new PathItem()
                .post(new Operation()
                        .summary(summary)
                        .description(description + " Note: This is a WebSocket STOMP message, not an HTTP endpoint. " +
                                "Send via STOMP client after connecting to /ws")
                        .operationId(summary.toLowerCase().replaceAll("\\s+", "_"))
                        .requestBody(new io.swagger.v3.oas.models.parameters.RequestBody()
                                .description("STOMP message body as JSON")
                                .required(true)
                                .content(new Content()
                                        .addMediaType("application/json", new MediaType()
                                                .schema(new io.swagger.v3.oas.models.media.Schema<>()
                                                        .type("object")
                                                        .description(requestBodyType)))))
                        .responses(new ApiResponses()
                                .addApiResponse("200", new ApiResponse()
                                        .description("Message processed successfully (sent via WebSocket)"))
                                .addApiResponse("400", new ApiResponse()
                                        .description("Bad Request - Invalid message format"))
                                .addApiResponse("401", new ApiResponse()
                                        .description("Unauthorized - Authentication required"))));
    }
}


