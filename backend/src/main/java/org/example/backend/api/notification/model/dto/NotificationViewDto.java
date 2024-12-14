package org.example.backend.api.notification.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.NotificationType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationViewDto {
    private NotificationType notificationType;
    private String notificationMessage;
    private Long tradeRequestId;
    private boolean notificationIsRead;
}