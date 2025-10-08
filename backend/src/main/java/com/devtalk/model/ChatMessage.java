package com.devtalk.model;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private String messageContent;
    private String messageAuthor;
    private MessageType messageType;
}
