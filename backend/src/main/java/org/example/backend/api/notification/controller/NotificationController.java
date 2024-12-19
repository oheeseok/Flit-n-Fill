package org.example.backend.api.notification.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.api.notification.service.NotificationService;
import org.example.backend.enums.NotificationType;
import org.example.backend.exceptions.UserIdNullException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    public String sendEmail() {
        notificationService.sendExpirationEmail();
        return "메일 전송 완료";
    }
}
