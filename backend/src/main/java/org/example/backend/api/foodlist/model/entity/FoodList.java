package org.example.backend.api.foodlist.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.myfridge.model.entity.Food;
import org.example.backend.api.post.model.entity.Post;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "foodlist")
public class FoodList {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long foodListId;

  @Column(length = 20, nullable = false)
  @NotNull
  private String foodListGroup;

  @Column(length = 45, nullable = false)
  @NotNull
  private String foodListProduct;

  @Column(length = 20)
  private String foodListType;

  @Column(nullable = false)
  @NotNull
  private int foodListIcon;

  // 연관관계 및 cascade 설정

  @OneToMany(mappedBy = "foodList", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
  private List<Food> foods;

  @OneToMany(mappedBy = "proposerFoodList", fetch = FetchType.LAZY)
  private List<Post> postList;
}
