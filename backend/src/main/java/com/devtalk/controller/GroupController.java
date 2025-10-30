package com.devtalk.controller;

import com.devtalk.dto.base.GroupBaseDTO;
import com.devtalk.dto.channel.ChannelMessagesDTO;
import com.devtalk.dto.groups.GroupResponseDTO;
import com.devtalk.service.GroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/groups")
@Tag(name = "Groups", description = "Group retrieval operations")
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/default")
    @Operation(summary = "Get default group", description = "Retrieves the default group")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved default group")
    public ResponseEntity<GroupResponseDTO> getDefaultGroup() {
        return ResponseEntity.ok(groupService.getDefaultGroup());
    }


}
