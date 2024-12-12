package org.example.backend.api.post.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.FoodUnit;
import org.example.backend.enums.TradeType;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long postId;
  @Column(nullable = false)
  @NotNull
  private Long userId;
  @Column(length = 10, nullable = false)
  @NotNull
  private String writerFood;
  @Column(nullable = false)
  @NotNull
  private int writerCount;
  @Column(length = 10, nullable = false)
  @NotNull
  private FoodUnit writerUnit;
  @Column(length = 10)
  private String proposerFood;
  private int proposerCount;
  @Column(length = 10)
  private FoodUnit proposerUnit;
  @Column(nullable = false)
  @NotNull
  private LocalDateTime postCreatedDate;
  @Column(length = 10, nullable = false)
  @NotNull
  private TradeType tradeType;
  @Column(length = 45, nullable = false)
  @NotNull
  private String postTitle;
  @Lob
  @Column(nullable = false)
  @NotNull
  private String postContent;
  @Column(length = 50, nullable = false)
  @NotNull
  private String meetingPlace;
  @Column(length = 50, nullable = false)
  @NotNull
  private String meetingTime;
  @Column(length = 255, nullable = false)
  @NotNull
  private String postPhoto1;
  @Column(length = 255)
  private String postPhoto2;
}
