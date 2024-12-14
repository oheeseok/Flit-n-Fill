package org.example.backend.api.myfridge.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.foodlist.model.entity.FoodList;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.FoodCategory;
import org.example.backend.enums.FoodStorage;
import org.example.backend.enums.FoodUnit;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

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

  @Column(length = 10, nullable = false)
  @NotNull
  private FoodCategory foodCategory;

  private LocalDate foodRegistDate;

  @NotNull
  private int foodCount;

  @NotNull
  private FoodUnit foodUnit;

  private LocalDate foodProDate;

  @Column(nullable = false)
  @NotNull
  private LocalDate foodExpDate;

  @Column(length = 10, nullable = false)
  @NotNull
  private FoodStorage foodStorage;

  @ColumnDefault("false")
  private boolean foodIsThaw = false;

  private String foodDescription;
}
