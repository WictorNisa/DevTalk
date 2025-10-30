package com.devtalk.dto.groups;

import com.devtalk.dto.base.GroupBaseDTO;
import com.devtalk.dto.channel.ChannelResponseDTO;
import com.devtalk.dto.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GroupResponseDTO extends GroupBaseDTO {
    private Set<UserResponseDTO> members;
    private Set<ChannelResponseDTO> channels;
}
