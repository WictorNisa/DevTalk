package com.devtalk.dto.user;

import com.devtalk.dto.base.UserBaseDTO;
import com.devtalk.enums.ConnectionType;
import com.devtalk.enums.PresenceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserStatusMessageDTO extends UserBaseDTO {

    public ConnectionType connectionType;
    private String sessionId;
    private String destination;
    private long timestamp;

    public static UserStatusMessageDTO of(ConnectionType type, String sessionId, String destination, String displayName, PresenceStatus presence) {
        return UserStatusMessageDTO.builder()
                .connectionType(type)
                .sessionId(sessionId)
                .destination(destination)
                .displayName(displayName)
                .presenceStatus(presence)
                .timestamp(System.currentTimeMillis())
                .build();
    }
}
