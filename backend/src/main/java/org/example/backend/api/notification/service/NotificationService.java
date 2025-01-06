package org.example.backend.api.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.notification.model.dto.NotificationViewDto;
import org.example.backend.api.notification.repository.NotificationRepository;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.trade.repository.TradeRequestRepository;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.RequestRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.enums.NotificationType;
import org.example.backend.exceptions.RequestNotFoundException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

  public void saveTradeRequestNotification(User user, NotificationType type, String message, Long tradeRequestId, String tradeRoomId) {   // 교환, 나눔 요청 시 알림

    Notification notification = new Notification();
    notification.setUser(user);
    notification.setNotificationType(type);
    notification.setNotificationMessage(message);
    if (tradeRequestId == null) {
      notification.setTradeRequest(null);
    } else {
      TradeRequest tradeRequest = tradeRequestRepository.findById(tradeRequestId).orElseThrow(() -> new RequestNotFoundException("tradeRequest not found"));
      notification.setTradeRequest(tradeRequest != null ? tradeRequest : null);
    }
    notification.setTradeRoomId(tradeRoomId != null ? tradeRoomId : null);

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
        .sorted((n1, n2) -> Long.compare(n2.getNotificationId(), n1.getNotificationId())) // ID 기준 역순 정렬
        .collect(Collectors.toList());
    return notificationsList;
  }

  public void readOneNotification(Long userId, Long notificationId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("회원을 찾을 수 없습니다."));
    Notification notification = notificationRepository.findByNotificationId(notificationId);
    notification.setNotificationIsRead(true);
    notificationRepository.save(notification);
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
