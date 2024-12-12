package org.example.backend.enums;

public enum FoodUnit {
  KG("kg"),
  G("g"),
  L("L"),
  ML("mL"),
  PIECE("개");

  private final String description;

  // 생성자 (Singleton)
  FoodUnit(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
