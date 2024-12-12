package org.example.backend.enums;

public enum Progress {
  PENDING("대기"),
  IN_PROGRESS("진행중"),
  COMPLETED("완료"),
  CANCELED("취소");

  private final String description;

  // 생성자 (Singleton)
  Progress(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
