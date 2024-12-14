package org.example.backend.api.notification.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.user.model.entity.Request;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.NotificationType;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long notificationId;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @JoinColumn(name = "user_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private User user;

  @Enumerated(EnumType.STRING) // Java 레벨
  @Column(nullable = false)
  @NotNull
  private NotificationType notificationType;

  @Column(nullable = false)
  @NotNull
  private String notificationMessage;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @JoinColumn(name = "trade_request_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private TradeRequest tradeRequest;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @JoinColumn(name = "request_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Request request;

  @Column(nullable = false)
  @ColumnDefault("false")
  @NotNull
  private boolean notificationIsRead = false;
}
