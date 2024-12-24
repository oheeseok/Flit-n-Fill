package org.example.backend.api.notification.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.model.dto.NotificationViewDto;
import org.example.backend.api.notification.service.EmailService;
import org.example.backend.api.notification.service.NotificationService;
import org.example.backend.enums.NotificationType;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<List<NotificationViewDto>> getAllNotifications(HttpServletRequest request) {  // 알림 전체 조회
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("User ID is null");
        }

        List<NotificationViewDto> notifications = notificationService.getAllNotifications(userId);
        return ResponseEntity.status(HttpStatus.OK).body(notifications);
    }

    @PatchMapping("/read")
    public ResponseEntity<Void> readAllNotifications(HttpServletRequest request) {   // 알림 전체 읽음 처리
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("User ID is null");
        }

        notificationService.readAllNotifications(userId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteAllNotifications(HttpServletRequest request) {    // 알림 전체 삭제
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("User ID is null");
        }

        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteOneNotification(HttpServletRequest request, @PathVariable("notificationId") Long notificationId) {    // 알림 개별 삭제
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("User ID is null");
        }

        notificationService.deleteOneNotification(userId, notificationId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    public String sendExpirationEmail() {   // 소비기한 임박 재료 알림 메일링
        emailService.sendExpirationEmail();
        return "메일 전송 완료";
    }
}
