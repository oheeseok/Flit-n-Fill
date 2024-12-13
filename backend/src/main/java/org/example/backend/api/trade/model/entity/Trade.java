package org.example.backend.api.trade.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.Progress;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Trade {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long tradeId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="post_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL) // 부모 삭제 시 외래 키 null 처리
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="proposer_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL) // 부모 삭제 시 외래 키 null 처리
  private User proposer;

  @Column(length = 10, nullable = false)
  @Enumerated(EnumType.STRING)
  @ColumnDefault("'PENDING'")
  @NotNull
  private Progress progress = Progress.PENDING;

  private LocalDateTime tradeCreatedDate;
  private LocalDateTime tradeUpdatedDate;
}
