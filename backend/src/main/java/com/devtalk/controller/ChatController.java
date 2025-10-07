package com.devtalk.controller;

import com.devtalk.model.ChatMessage;
import com.devtalk.model.MessageType;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;


@Controller
public class ChatController {

    // Receives the chat messages and returns them to the /topic/public destination
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
        return chatMessage;
    }

    // Adds the username in the web socket session attributes
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        String author = chatMessage.getMessageAuthor();
        if (author != null && !author.trim().isEmpty()) {
            headerAccessor.getSessionAttributes().put("username", author);
            return chatMessage;
        }
        else {
            ChatMessage errorMessage = new ChatMessage();
            errorMessage.setMessageType(MessageType.ERROR);
            errorMessage.setMessageAuthor("System");
            errorMessage.setMessageContent("Error: Username cannot be empty");
            return errorMessage;
        }
    }
}
