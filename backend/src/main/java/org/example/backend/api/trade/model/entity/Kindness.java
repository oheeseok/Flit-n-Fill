package org.example.backend.api.trade.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.KindnessType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Kindness {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long kindnessId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reviewer_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  private User reviewer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reviewee_id", nullable = true)
  @OnDelete(action = OnDeleteAction.SET_NULL)
  private User reviewee;

  @Column(nullable = false)
  @NotNull
  private String tradeRoomId;

  @Enumerated(EnumType.STRING) // Java 레벨
  @Column(nullable = false)
  @NotNull
  private KindnessType kindnessType;
}
