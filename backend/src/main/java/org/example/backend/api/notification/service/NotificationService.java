package org.example.backend.api.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.myfridge.repository.MyfridgeRepository;
import org.example.backend.api.notification.model.dto.NotificationViewDto;
import org.example.backend.api.notification.repository.NotificationRepository;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.post.repository.PostRepository;
import org.example.backend.api.trade.model.entity.Trade;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.trade.repository.TradeRequestRepository;
import org.example.backend.api.trade.service.TradeService;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.enums.Progress;
import org.example.backend.enums.TaskStatus;
import org.example.backend.enums.TradeType;
import org.example.backend.exceptions.RequestNotFoundException;
import org.example.backend.exceptions.TradeRequestHandleException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
@EnableScheduling
public class NotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final RequestRepository requestRepository;
    private final TradeRequestRepository tradeRequestRepository;

    @Value("${server.host}")
    private String host;

    @Value("${server.port}")
    private String port;

    public void saveTradeRequestNotification(User user, NotificationType type, String message, Long tradeRequestId) {   // 교환, 나눔 요청 시 알림
        TradeRequest tradeRequest = tradeRequestRepository.findById(tradeRequestId).orElseThrow(() -> new RequestNotFoundException("tradeRequest not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setNotificationType(type);
        notification.setNotificationMessage(message);
        notification.setTradeRequest(tradeRequest);

        notificationRepository.save(notification);
    }

    public void saveRequestNotification(User user, NotificationType type, String message, Long requestId) {     // 재료추가 or 신고 요청 시 알림
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new RequestNotFoundException("request not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setNotificationType(type);
        notification.setNotificationMessage(message);
        notification.setRequest(request);

        notificationRepository.save(notification);
    }

    public List<NotificationViewDto> getAllNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        List<NotificationViewDto> notificationsList = notificationRepository.findByUser(user).stream()
                .map(n -> NotificationViewDto.of(n))
                .collect(Collectors.toList());
        return notificationsList;
    }

    public void readAllNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUser(user);
        for (Notification notification : notifications) {
            notification.setNotificationIsRead(true);
            notificationRepository.save(notification);
        }
    }

    public void deleteAllNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByUser(user);
        notificationRepository.deleteAll(notifications);
    }

    public void deleteOneNotification(Long userId, Long notificationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));

        Notification notification = notificationRepository.findByNotificationId(notificationId);
        notificationRepository.delete(notification);
    }

}
