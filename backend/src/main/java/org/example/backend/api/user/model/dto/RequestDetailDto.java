package org.example.backend.api.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.RequestType;
import org.example.backend.enums.TaskStatus;

import java.time.LocalDateTime;
import java.util.Optional;

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
    private String responseMessage;

    public static RequestDetailDto of(Request request) {
        return new RequestDetailDto(
                request.getRequestId(),
                request.getRequestUser().getUserId(),
                request.getRequestType(),
                request.getRequestContent(),
                Optional.ofNullable(request.getReportedUser())
                        .map(User::getUserId)
                        .orElse(null),
                request.getRequestDate(),
                request.getResponseStatus(),
                request.getResponseMessage()
        );
    }
}
