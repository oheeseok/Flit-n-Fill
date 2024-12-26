package org.example.backend.api.user.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.notification.model.entity.Notification;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.trade.model.entity.Kindness;
import org.example.backend.api.trade.model.entity.Trade;
import org.example.backend.api.trade.model.entity.TradeRequest;
import org.example.backend.enums.AuthProvider;
import org.example.backend.enums.Role;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long userId;

  private String userName;

  @Column(length = 50, unique = true)
  private String userEmail;

  @Column(length = 20)
  private String userNickname;

  @Size(min = 10, max = 15, message = "비밀번호의 길이는 10자에서 15자 사이입니다.")
  @Pattern(regexp = "[a-zA-Z0-9`~!@#$%^&*()_=+|{};:,.<>/?]*$", message = "비밀번호 형식이 일치하지 않습니다")
  private String userPassword;

  @Column(length = 13)
  private String userPhone;

  @Column(length = 20)
  private String userAddress;

  private String userProfile;

  @Column(columnDefinition = "TINYINT", nullable = false)
  @ColumnDefault("1")
  @NotNull
  private int userKindness;

  @Column(columnDefinition = "INT", nullable = false)
  @ColumnDefault("50")
  @NotNull
  private int userExp;

  private String refreshToken;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  @NotNull
  @ColumnDefault("'USER'")
  private Role role;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  @NotNull
  @ColumnDefault("'LOCAL'")
  private AuthProvider authProvider;

  @PrePersist
  public void prePersist() {
    if (authProvider == null) {
      this.authProvider = AuthProvider.LOCAL;
    }
    if (role == null) {
      this.role = Role.USER;  // 기본값 설정
    }
  }
  // 생성자
  public User(String userName, String userEmail, String userNickname, String userPassword,
              String userPhone, String userAddress, String userProfile, int userKindness, int userExp,
              AuthProvider authProvider) {
    this.userName = userName;
    this.userEmail = userEmail;
    this.userNickname = userNickname;
    this.userPassword = userPassword;
    this.userPhone = userPhone;
    this.userAddress = userAddress;
    this.userProfile = userProfile;
    this.userKindness = userKindness;
    this.userExp = userExp;
    this.authProvider = authProvider;
  }

  // 연관관계 및 cascade 설정
  @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private BlackList blackList;

  @OneToMany(mappedBy = "requestUser", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Request> requestUserList;  // 신고한 회원

  @OneToMany(mappedBy = "reportedUser", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Request> reportedUserList;  // 신고 받은 회원

  @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private UserCart userCart;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Food> foodList;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Post> postList;

  @OneToMany(mappedBy = "proposer", fetch = FetchType.LAZY)
  private List<Trade> tradeList;

  @OneToMany(mappedBy = "reviewer", fetch = FetchType.LAZY)
  private List<Kindness> reviewerList;

  @OneToMany(mappedBy = "reviewee", fetch = FetchType.LAZY)
  private List<Kindness> revieweeList;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<BookmarkedRecipe> bookmarkedRecipeList;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Notification> notificationList;

  @OneToMany(mappedBy = "proposer", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<TradeRequest> tradeRequestList;
}
