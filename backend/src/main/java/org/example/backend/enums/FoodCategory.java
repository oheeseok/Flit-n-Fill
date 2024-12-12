package org.example.backend.enums;

public enum FoodCategory {
  INGREDIENT("재료"),
  COOKED("완제품");

  private final String description;

  // 생성자 (Singleton)
  FoodCategory(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
