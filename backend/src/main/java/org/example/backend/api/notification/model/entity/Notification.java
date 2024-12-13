package org.example.backend.api.notification.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.NotificationType;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long notificationId;

  @Column(nullable = false)
  @NotNull
  private Long userId;

  @Enumerated(EnumType.STRING) // Java 레벨
  @Column(nullable = false)
  @NotNull
  private NotificationType notificationType;

  @Column(nullable = false)
  @NotNull
  private String notificationMessage;

  @Column(nullable = false)
  @NotNull
  private Long tradeRequestId;

  @Column(nullable = false)
  @NotNull
  private Long requestId;

  @Column(nullable = false)
  @ColumnDefault("false")
  @NotNull
  private boolean notificationIsRead = false;
}
