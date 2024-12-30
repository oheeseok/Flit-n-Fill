package org.example.backend.api.trade.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.TaskStatus;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="traderequest")
public class TradeRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long tradeRequestId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private User proposer;

  @Enumerated(EnumType.STRING)
  @ColumnDefault("'PENDING'")
  private TaskStatus tradeTaskStatus = TaskStatus.PENDING;

  @Column(nullable = false)
  @NotNull
  private LocalDateTime requestCreatedDate;

  public TradeRequest(Long tradeRequestId, Post post, User proposer, TaskStatus tradeTaskStatus, LocalDateTime requestCreatedDate) {
    this.tradeRequestId = tradeRequestId;
    this.post = post;
    this.proposer = proposer;
    this.tradeTaskStatus = tradeTaskStatus;
    this.requestCreatedDate = requestCreatedDate;
  }

  @OneToMany(mappedBy = "tradeRequest", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Notification> notificationList;
}
