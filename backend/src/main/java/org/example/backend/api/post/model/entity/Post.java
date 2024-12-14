package org.example.backend.api.post.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.trade.model.entity.Trade;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.FoodUnit;
import org.example.backend.enums.TradeType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long postId;

  @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  @JoinColumn(name = "user_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private User user;

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

  @Column(nullable = false)
  @NotNull
  private String postPhoto1;

  private String postPhoto2;

  @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
  private List<Trade> tradeList;

  @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<TradeRequest> tradeRequestList;
}
