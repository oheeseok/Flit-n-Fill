package org.example.backend.api.foodlist.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
