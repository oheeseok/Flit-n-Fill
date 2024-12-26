package org.example.backend.api.notification.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.enums.NotificationType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationViewDto {
    private NotificationType notificationType;
    private String notificationMessage;
    private Long tradeRequestId;
    private String tradeRoomId;
    private boolean notificationIsRead;

    public static NotificationViewDto of(Notification n) {
        NotificationViewDto dto = new NotificationViewDto();
        dto.setNotificationType(n.getNotificationType());
        dto.setNotificationMessage(n.getNotificationMessage());
        dto.setNotificationIsRead(n.isNotificationIsRead());
        if (n.getTradeRequest() != null) {
            dto.setTradeRequestId(n.getTradeRequest().getTradeRequestId());
        } else {
            dto.setTradeRequestId(null);
        }
        if (n.getTradeRoomId() != null) {
          dto.setTradeRoomId(n.getTradeRoomId());
        } else {
          dto.setTradeRoomId(null);
        }

        return dto;
    }
}