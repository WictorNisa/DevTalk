package com.devtalk.dtos.groups;

import com.devtalk.dtos.base.GroupBaseDTO;
import com.devtalk.dtos.channel.ChannelResponseDTO;
import com.devtalk.dtos.user.UserResponseDTO;
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
