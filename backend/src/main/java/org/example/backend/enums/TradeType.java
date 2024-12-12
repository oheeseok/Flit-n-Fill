package org.example.backend.enums;

public enum TradeType {
  SHARING("나눔"),
  EXCHANGE("교환");

  private final String description;

  // 생성자 (Singleton)
  TradeType(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
