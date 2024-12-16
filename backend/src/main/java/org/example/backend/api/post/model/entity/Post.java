package org.example.backend.api.post.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.post.model.dto.PostRegisterDto;
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
  private String address; // (글 등록 당시의) 사용자 위치

  @Column(length = 10, nullable = false)
  @NotNull
  private String writerFood;

  @Column(nullable = false)
  @NotNull
  private int writerCount;

  @Enumerated(EnumType.STRING)
  @Column(length = 10, nullable = false)
  @NotNull
  private FoodUnit writerUnit;

  @Column(length = 10)
  private String proposerFood;

  private int proposerCount;

  @Enumerated(EnumType.STRING)
  @Column(length = 10)
  private FoodUnit proposerUnit;

  @Column(nullable = false)
  @NotNull
  private LocalDateTime postCreatedDate;

  @Enumerated(EnumType.STRING)
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

  @Column(nullable = false)
  @NotNull
  private LocalDateTime meetingTime;

  @Column(nullable = false)
  @NotNull
  private String postPhoto1;

  private String postPhoto2;

  // 연관관계
  @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
  private List<Trade> tradeList;

  @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<TradeRequest> tradeRequestList;

  // of 메서드
  public static Post of(User user, PostRegisterDto dto) {
    Post post = new Post();
    post.setUser(user);
    post.setAddress(user.getUserAddress());
    post.setWriterFood(dto.getWriterFood());
    post.setWriterCount(dto.getWriterCount());
    post.setWriterUnit(dto.getWriterUnit());
    post.setProposerFood(dto.getProposerFood());
    post.setProposerCount(dto.getProposerCount());
    post.setProposerUnit(dto.getProposerUnit());
    post.setPostContent(dto.getPostContent());
    post.setPostPhoto1(dto.getPostPhoto1());
    post.setPostPhoto2(dto.getPostPhoto2());
    post.setTradeType(dto.getTradeType());
    post.setMeetingPlace(dto.getMeetingPlace());
    post.setMeetingTime(dto.getMeetingTime());
    post.setPostCreatedDate(LocalDateTime.now());

    String postTitle = String.format("[%s/%s] %s -> %s",
            dto.getTradeType().getDescription(),
            user.getUserAddress(),
            dto.getWriterFood(),
            dto.getProposerFood());

    post.setPostTitle(postTitle);

    return post;
  }
}
