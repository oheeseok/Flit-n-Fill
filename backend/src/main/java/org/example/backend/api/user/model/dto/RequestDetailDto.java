package org.example.backend.api.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.RequestType;
import org.example.backend.enums.TaskStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestDetailDto {
    private Long requestId;
    private Long requestUserId;
    private RequestType requestType;
    private String requestContent;
    private Long reportedUserId;
    private LocalDateTime requestDate;
    private TaskStatus responseStatus;
}
