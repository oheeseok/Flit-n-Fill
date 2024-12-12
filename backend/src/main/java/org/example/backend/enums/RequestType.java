package org.example.backend.enums;

public enum RequestType {
  ADD_FOOD("재료 추가"),
  REPORT("신고");

  private final String description;

  // 생성자 (Singleton)
  RequestType(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
