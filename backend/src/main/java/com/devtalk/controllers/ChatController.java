package com.devtalk.controllers;

import com.devtalk.dtos.base.MessageBaseDTO;
import com.devtalk.dtos.messages.AttachmentDTO;
import com.devtalk.dtos.messages.ChatMessageDTO;
import com.devtalk.dtos.messages.MessageDeleteDTO;
import com.devtalk.dtos.messages.MessageEditDTO;
import com.devtalk.dtos.messages.MessageReactionDTO;
import com.devtalk.dtos.messages.PingPongMessageDTO;
import com.devtalk.dtos.messages.ReadReceiptDTO;
import com.devtalk.dtos.messages.TypingDTO;
import com.devtalk.services.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chat", description = "Chat API")
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    @Operation(summary = "Handle ping message", description = "Handles the ping message and returns a pong message")
    @ApiResponse(responseCode = "200", description = "Pong message sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public PingPongMessageDTO handlePing(MessageBaseDTO pingMessage, Principal principal) {
        return chatService.handlePing(pingMessage);
    }

    @MessageMapping("/chat.send")
    @Operation(summary = "Handle chat message", description = "Handles the chat message and sends it to the destination")
    @ApiResponse(responseCode = "200", description = "Message sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleChat(ChatMessageDTO message, Principal principal) {
        chatService.sendMessage(message, principal);
    }

    @MessageMapping("/message.react")
    @Operation(summary = "Add reaction", description = "Adds a reaction to a message and broadcasts it")
    public void react(MessageReactionDTO dto) {
        chatService.addReaction(dto);
    }

    @MessageMapping("/message.unreact")
    @Operation(summary = "Remove reaction", description = "Removes a reaction from a message and broadcasts it")
    public void unreact(MessageReactionDTO dto) {
        chatService.removeReaction(dto);
    }

    @MessageMapping("/message.attach")
    @Operation(summary = "Attach file", description = "Attaches a file to a message and broadcasts updated message")
    public void attach(AttachmentDTO dto) {
        chatService.attachFile(dto);
    }

    @MessageMapping("/chat.edit")
    @Operation(summary = "Edit chat message", description = "Edits an existing message and broadcasts the update")
    public void handleEdit(MessageEditDTO edit, Principal principal) {
        chatService.editMessage(edit);
    }

    @MessageMapping("/chat.delete")
    @Operation(summary = "Delete chat message", description = "Deletes a message and broadcasts a tombstone event")
    public void handleDelete(MessageDeleteDTO del, Principal principal) {
        chatService.deleteMessage(del);
    }

    @MessageMapping("/typing.start")
    @Operation(summary = "Typing start", description = "Broadcast typing start event")
    public void typingStart(TypingDTO dto) {
        chatService.broadcastTypingStart(dto);
    }

    @MessageMapping("/typing.stop")
    @Operation(summary = "Typing stop", description = "Broadcast typing stop event")
    public void typingStop(TypingDTO dto) {
        chatService.broadcastTypingStop(dto);
    }

    @MessageMapping("/message.read")
    @Operation(summary = "Read receipt", description = "Broadcast single read receipt")
    public void readReceipt(ReadReceiptDTO dto) {
        chatService.broadcastReadReceipt(dto);
    }

    @MessageMapping("/message.history")
    @Operation(summary = "Handle message history", description = "Handles the message history request and sends it to the user")
    @ApiResponse(responseCode = "200", description = "Message history sent successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleMessageHistory(MessageBaseDTO request, Principal principal) {
        chatService.sendMessageHistory(request, principal);
    }

    @MessageMapping("/thread.replies")
    @Operation(summary = "Get thread replies", description = "Retrieves all replies for a parent message (thread)")
    @ApiResponse(responseCode = "200", description = "Thread replies retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleThreadReplies(MessageBaseDTO request, Principal principal) {
        chatService.sendThreadReplies(request, principal);
    }

    @MessageMapping("/thread.messages")
    @Operation(summary = "Get thread messages", description = "Retrieves all messages in a thread by thread ID")
    @ApiResponse(responseCode = "200", description = "Thread messages retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleThreadMessages(MessageBaseDTO request, Principal principal) {
        chatService.sendThreadMessages(request, principal);
    }

    @MessageMapping("/thread.list")
    @Operation(summary = "Get channel threads", description = "Retrieves all threads in a channel")
    @ApiResponse(responseCode = "200", description = "Channel threads retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleChannelThreads(MessageBaseDTO request, Principal principal) {
        chatService.sendChannelThreads(request, principal);
    }

    @MessageMapping("/message.search")
    @Operation(summary = "Search messages", description = "Searches for messages containing the query text")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleMessageSearch(MessageBaseDTO request, Principal principal) {
        chatService.sendSearchResults(request, principal);
    }

    @MessageMapping("/message.get")
    @Operation(summary = "Get message by ID", description = "Retrieves a single message by its ID")
    @ApiResponse(responseCode = "200", description = "Message retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleGetMessage(MessageBaseDTO request, Principal principal) {
        chatService.sendMessageById(request, principal);
    }

    @MessageMapping("/message.read.bulk")
    @Operation(summary = "Bulk read receipts", description = "Marks multiple messages as read at once")
    @ApiResponse(responseCode = "200", description = "Bulk read receipts processed successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleBulkReadReceipts(ReadReceiptDTO dto) {
        chatService.broadcastBulkReadReceipt(dto);
    }

    @MessageMapping("/mentions.list")
    @Operation(summary = "Get user mentions", description = "Retrieves all messages where the user was mentioned")
    @ApiResponse(responseCode = "200", description = "Mentions retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public void handleGetMentions(MessageBaseDTO request, Principal principal) {
        chatService.sendUserMentions(request, principal);
    }

    @MessageMapping("/ping.latency")
    @SendTo("/topic/latency-pong")
    @Operation(summary = "Latency test", description = "Measures round-trip latency by echoing server timestamp")
    @ApiResponse(responseCode = "200", description = "Latency test completed successfully")
    @ApiResponse(responseCode = "400", description = "Bad request")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public PingPongMessageDTO handleLatencyTest(MessageBaseDTO pingMessage, Principal principal) {
        return chatService.handleLatencyTest(pingMessage);
    }
}
