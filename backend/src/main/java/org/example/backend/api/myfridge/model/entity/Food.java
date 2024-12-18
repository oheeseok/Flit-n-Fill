package org.example.backend.api.myfridge.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.FoodCategory;
import org.example.backend.enums.FoodStorage;
import org.example.backend.enums.FoodUnit;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Food {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long foodId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "food_list_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private FoodList foodList;

  @Column(length = 10, nullable = false)
  @NotNull
  private String foodListName;

  @Enumerated(EnumType.STRING)
  @Column(length = 10, nullable = false)
  @NotNull
  private FoodCategory foodCategory;

  private LocalDate foodRegistDate;

  @NotNull
  private float foodCount;

  @Enumerated(EnumType.STRING)
  @NotNull
  private FoodUnit foodUnit;

  private LocalDate foodProDate;

  @Column(nullable = false)
  @NotNull
  private LocalDate foodExpDate;

  @Enumerated(EnumType.STRING)
  @Column(length = 10, nullable = false)
  @NotNull
  private FoodStorage foodStorage;

  @ColumnDefault("false")
  private boolean foodIsThaw = false;

  private String foodDescription;

  // 연관관계 및 cascade 설정
  @OneToMany(mappedBy = "writerFood", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Post> postList;

  // 생성자

  public Food(Long foodId, User user, FoodList foodList, String foodListName, FoodCategory foodCategory, LocalDate foodRegistDate, float foodCount, FoodUnit foodUnit, LocalDate foodProDate, LocalDate foodExpDate, FoodStorage foodStorage, boolean foodIsThaw, String foodDescription) {
    this.foodId = foodId;
    this.user = user;
    this.foodList = foodList;
    this.foodListName = foodListName;
    this.foodCategory = foodCategory;
    this.foodRegistDate = foodRegistDate;
    this.foodCount = foodCount;
    this.foodUnit = foodUnit;
    this.foodProDate = foodProDate;
    this.foodExpDate = foodExpDate;
    this.foodStorage = foodStorage;
    this.foodIsThaw = foodIsThaw;
    this.foodDescription = foodDescription;
  }
}
