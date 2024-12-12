package org.example.backend.enums;

public enum FoodStorage {
  ROOM_TEMPERATURE("실온"),
  FROZEN("냉동"),
  REFRIGERATED("냉장");

  private final String description;

  // 생성자 (Singleton)
  FoodStorage(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
