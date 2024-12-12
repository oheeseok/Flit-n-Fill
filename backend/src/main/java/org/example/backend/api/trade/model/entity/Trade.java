package org.example.backend.api.trade.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.Progress;
import org.hibernate.annotations.ColumnDefault;

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
  private Long postId;
  private Long proposerId;
  @Column(length = 10, nullable = false)
  @Enumerated(EnumType.STRING)
  @ColumnDefault("'PENDING'")
  @NotNull
  private Progress progress = Progress.PENDING;
  private LocalDateTime tradeCreatedDate;
  private LocalDateTime tradeUpdatedDate;
}
