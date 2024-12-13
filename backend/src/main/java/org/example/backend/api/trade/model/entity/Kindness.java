package org.example.backend.api.trade.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.KindnessType;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Kindness {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long kindnessId;

  @Column(nullable = false)
  @NotNull
  private Long reviewerId;

  @Column(nullable = false)
  @NotNull
  private Long revieweeId;

  @Column(nullable = false)
  @NotNull
  private Long tradeRoomId;

  @Enumerated(EnumType.STRING) // Java 레벨
  @Column(nullable = false)
  @NotNull
  private KindnessType kindnessType;
}
