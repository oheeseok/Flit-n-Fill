package org.example.backend.api.trade.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.TaskStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Traderequest")
public class TradeRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long tradeRequestId;

  private Long postId;
  private Long proposerId;
  private TaskStatus tradeTaskStatus;
  @Column(nullable = false)
  @NotNull
  private LocalDateTime requestCreatedDate;
}
