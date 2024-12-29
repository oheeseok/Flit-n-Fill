package org.example.backend.api.notification.repository;

import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Notification findByNotificationId(Long notificationId);
    List<Notification> findByUser(User user);
}
