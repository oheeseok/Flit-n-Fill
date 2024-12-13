package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "blacklist")
public class BlackList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long blackListId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @NotNull
  private User user;

  @Column(nullable = false)
  @ColumnDefault("0")
  @NotNull
  private int userReportedCount;

  @Column(nullable = false)
  @NotNull
  private LocalDate userLastReportedDate;
}
