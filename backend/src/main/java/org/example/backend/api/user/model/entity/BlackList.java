package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="blacklist")
public class BlackList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long blackListId;
  @Column(nullable = false)
  @NotNull
  private Long userId;
  @Column(nullable = false)
  @NotNull
  private int userReportedCount;
  @Column(nullable = false)
  @NotNull
  private LocalDate userLastReportedDate;
}
