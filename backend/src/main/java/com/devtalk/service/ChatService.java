package com.devtalk.service;

import com.devtalk.dto.base.MessageBaseDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.messages.AttachmentDTO;
import com.devtalk.dto.messages.ChatMessageDTO;
import com.devtalk.dto.messages.DeliveryAckDTO;
import com.devtalk.dto.messages.MessageDeleteDTO;
import com.devtalk.dto.messages.MessageEditDTO;
import com.devtalk.dto.messages.MessageResponseDTO;
import com.devtalk.dto.messages.MessageReactionDTO;
import com.devtalk.dto.messages.MentionNotificationDTO;
import com.devtalk.dto.messages.PingPongMessageDTO;
import com.devtalk.dto.messages.ReadReceiptDTO;
import com.devtalk.dto.messages.TypingDTO;
import com.devtalk.dto.user.UserResponseDTO;
import com.devtalk.exception.ValidationException;
import com.devtalk.mappers.MessageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final MessageService messageService;
    private final UserService userService;
    private final ChannelService channelService;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageMapper messageMapper;

    @Transactional
    public void sendMessage(ChatMessageDTO message, Principal principal) {
        validateChatMessage(message);
        
        UserResponseDTO user = userService.getUserDTOById(message.getUserId());
        ChannelResponseDTO channel = channelService.getChannelDTOById(message.getChannelId());
        MessageResponseDTO savedMessage = messageService.saveMessage(message, user, channel);
        
        messagingTemplate.convertAndSend(message.getDestination(), savedMessage);
        log.info("Broadcasted message {} from user {} to {}", savedMessage.getId(), user.getDisplayName(), message.getDestination());
        
        sendMentionNotifications(savedMessage, user, channel);
        sendDeliveryAck(savedMessage, principal);
    }

    public void addReaction(MessageReactionDTO dto) {
        validateReactionDTO(dto);
        messageService.addReaction(dto.getMessageId(), dto.getUserId(), dto.getReactionType());
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    public void removeReaction(MessageReactionDTO dto) {
        validateReactionDTO(dto);
        messageService.removeReaction(dto.getMessageId(), dto.getUserId(), dto.getReactionType());
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    public MessageResponseDTO attachFile(AttachmentDTO dto) {
        validateAttachmentDTO(dto);
        MessageResponseDTO updated = messageService.addAttachment(dto);
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), updated);
        return updated;
    }

    @Transactional
    public void editMessage(MessageEditDTO edit) {
        validateEditDTO(edit);
        messageService.editMessage(edit.getMessageId(), edit.getContent(), edit.getUserId());
        MessageResponseDTO response = messageService.getMessageById(edit.getMessageId());
        messagingTemplate.convertAndSend("/topic/room/" + edit.getChannelId(), response);
    }

    @Transactional
    public void deleteMessage(MessageDeleteDTO del) {
        validateDeleteDTO(del);
        messageService.deleteMessage(del.getMessageId(), del.getUserId());
        
        PingPongMessageDTO tombstone = messageMapper.toPingPongMessageDTOForDelete(
                del.getChannelId(), del.getUserId(), del.getMessageId());
        
        messagingTemplate.convertAndSend("/topic/room/" + del.getChannelId(), tombstone);
    }

    public void broadcastTypingStart(TypingDTO dto) {
        validateTypingDTO(dto);
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    public void broadcastTypingStop(TypingDTO dto) {
        validateTypingDTO(dto);
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    public void broadcastReadReceipt(ReadReceiptDTO dto) {
        validateReadReceiptDTO(dto);
        if (dto.getReadAt() == null) {
            dto.setReadAt(System.currentTimeMillis());
        }
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
    }

    public void sendMessageHistory(MessageBaseDTO request, Principal principal) {
        if (request.getChannelId() == null) {
            throw new ValidationException("ChannelId is required");
        }

        List<MessageResponseDTO> messages;
        if (request.getBeforeTimestamp() != null && request.getBeforeTimestamp() > 0) {
            messages = messageService.getChannelMessagesBefore(request.getChannelId(), request.getBeforeTimestamp(), 50);
        } else {
            messages = messageService.getChannelMessages(request.getChannelId(), 50);
        }

        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/history", messages);
        log.info("Sent {} messages history for channel {} to user {}", messages.size(), request.getChannelId(), username);
    }

    public void sendThreadReplies(MessageBaseDTO request, Principal principal) {
        if (request.getParentMessageId() == null) {
            throw new ValidationException("ParentMessageId is required");
        }

        List<MessageResponseDTO> replies = messageService.getThreadReplies(request.getParentMessageId());
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/thread/replies", replies);
        log.info("Sent {} thread replies for parent message {} to user {}", replies.size(), request.getParentMessageId(), username);
    }

    public void sendThreadMessages(MessageBaseDTO request, Principal principal) {
        if (request.getThreadId() == null) {
            throw new ValidationException("ThreadId is required");
        }

        List<MessageResponseDTO> messages = messageService.getThreadMessages(request.getThreadId());
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/thread/messages", messages);
        log.info("Sent {} messages for thread {} to user {}", messages.size(), request.getThreadId(), username);
    }

    public void sendChannelThreads(MessageBaseDTO request, Principal principal) {
        if (request.getChannelId() == null) {
            throw new ValidationException("ChannelId is required");
        }

        List<MessageResponseDTO> threads = messageService.getChannelThreads(request.getChannelId());
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/thread/list", threads);
        log.info("Sent {} threads for channel {} to user {}", threads.size(), request.getChannelId(), username);
    }

    public void sendSearchResults(MessageBaseDTO request, Principal principal) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new ValidationException("Search query is required");
        }

        int limit = 50;
        List<MessageResponseDTO> results = messageService.searchMessages(request.getContent(), limit);
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/search", results);
        log.info("Sent {} search results for query '{}' to user {}", results.size(), request.getContent(), username);
    }

    public void sendMessageById(MessageBaseDTO request, Principal principal) {
        if (request.getId() == null) {
            throw new ValidationException("MessageId (id) is required");
        }

        MessageResponseDTO message = messageService.getMessageById(request.getId());
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/message", message);
        log.info("Sent message {} to user {}", request.getId(), username);
    }

    public void broadcastBulkReadReceipt(ReadReceiptDTO dto) {
        if (dto == null || dto.getChannelId() == null || dto.getUserId() == null) {
            throw new ValidationException("ChannelId and UserId are required");
        }

        if (dto.getReadAt() == null) {
            dto.setReadAt(System.currentTimeMillis());
        }
        
        messagingTemplate.convertAndSend("/topic/room/" + dto.getChannelId(), dto);
        log.info("Bulk read receipt broadcast for channel {} by user {}", dto.getChannelId(), dto.getUserId());
    }

    public void sendUserMentions(MessageBaseDTO request, Principal principal) {
        if (request.getUserId() == null) {
            throw new ValidationException("UserId is required");
        }

        List<MessageResponseDTO> mentions = messageService.getMessagesWhereUserMentioned(request.getUserId());
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/mentions", mentions);
        log.info("Sent {} mentions for user {} to user {}", mentions.size(), request.getUserId(), username);
    }

    public void sendErrorToUser(Principal principal, String errorMessage) {
        String username = getUsername(principal);
        messagingTemplate.convertAndSendToUser(username, "/queue/errors", errorMessage);
    }

    // Private helper methods

    private void validateChatMessage(ChatMessageDTO message) {
        if (message == null || message.getDestination() == null) {
            throw new ValidationException("Message and destination are required");
        }
        if (message.getUserId() == null) {
            throw new ValidationException("UserId is required");
        }
        if (message.getChannelId() == null) {
            throw new ValidationException("ChannelId is required");
        }
    }

    private void validateReactionDTO(MessageReactionDTO dto) {
        if (dto == null || dto.getMessageId() == null || dto.getUserId() == null 
                || dto.getChannelId() == null || dto.getReactionType() == null) {
            throw new ValidationException("Invalid reaction DTO: all fields are required");
        }
    }

    private void validateAttachmentDTO(AttachmentDTO dto) {
        if (dto == null || dto.getMessageId() == null || dto.getChannelId() == null) {
            throw new ValidationException("Invalid attachment DTO: messageId and channelId are required");
        }
    }

    private void validateEditDTO(MessageEditDTO edit) {
        if (edit == null || edit.getMessageId() == null || edit.getChannelId() == null || edit.getUserId() == null) {
            throw new ValidationException("Invalid edit payload: messageId, channelId, and userId are required");
        }
    }

    private void validateDeleteDTO(MessageDeleteDTO del) {
        if (del == null || del.getMessageId() == null || del.getChannelId() == null || del.getUserId() == null) {
            throw new ValidationException("Invalid delete payload: messageId, channelId, and userId are required");
        }
    }

    private void validateTypingDTO(TypingDTO dto) {
        if (dto == null || dto.getChannelId() == null || dto.getUserId() == null) {
            throw new ValidationException("Invalid typing DTO: channelId and userId are required");
        }
    }

    private void validateReadReceiptDTO(ReadReceiptDTO dto) {
        if (dto == null || dto.getChannelId() == null || dto.getMessageId() == null || dto.getUserId() == null) {
            throw new ValidationException("Invalid read receipt DTO: channelId, messageId, and userId are required");
        }
    }

    private void sendMentionNotifications(MessageResponseDTO savedMessage, UserResponseDTO sender, ChannelResponseDTO channel) {
        if (savedMessage.getMentionedUserIds() == null || savedMessage.getMentionedUserIds().isEmpty()) {
            return;
        }

        for (Long mentionedUserId : savedMessage.getMentionedUserIds()) {
            if (!mentionedUserId.equals(savedMessage.getUserId())) {
                UserResponseDTO mentionedUser = userService.getUserDTOById(mentionedUserId);
                String preview = createMessagePreview(savedMessage.getContent());
                
                MentionNotificationDTO notification = messageMapper.toMentionNotificationDTO(
                        savedMessage, sender, mentionedUser, channel, preview);
                
                messagingTemplate.convertAndSendToUser(mentionedUser.getExternalId(), "/queue/notifications", notification);
                log.info("Sent mention notification to user {} for message {}", mentionedUser.getDisplayName(), savedMessage.getId());
            }
        }
    }

    private void sendDeliveryAck(MessageResponseDTO message, Principal principal) {
        if (principal == null) {
            return;
        }

        String username = principal.getName();
        DeliveryAckDTO ack = messageMapper.toDeliveryAckDTO(message);
        messagingTemplate.convertAndSendToUser(username, "/queue/acks", ack);
    }

    private String createMessagePreview(String content) {
        if (content == null) {
            return "";
        }
        return content.length() > 100 ? content.substring(0, 100) + "..." : content;
    }

    private String getUsername(Principal principal) {
        return principal != null ? principal.getName() : "Unknown";
    }

    public PingPongMessageDTO handlePing(MessageBaseDTO pingMessage) {
        return messageMapper.toPingPongMessageDTO(pingMessage);
    }
}

