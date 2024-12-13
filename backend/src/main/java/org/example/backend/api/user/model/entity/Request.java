package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.RequestType;
import org.example.backend.enums.TaskStatus;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Request {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long requestId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "request_user_id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @NotNull
  private User user;

  @Enumerated(EnumType.STRING) // Java 레벨
  @Column(nullable = false)
  @NotNull
  private RequestType requestType;

  @Column(nullable = false)
  @NotNull
  private String requestContent;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reported_user_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private User reportedUser;

  @Column(nullable = false)
  @NotNull
  private LocalDateTime requestDate;

  @Enumerated(EnumType.STRING) // Java 레벨
  @Column(nullable = false)
  @ColumnDefault("'PENDING'") // SQL 레벨
  @NotNull
  private TaskStatus responseStatus = TaskStatus.PENDING;
}
