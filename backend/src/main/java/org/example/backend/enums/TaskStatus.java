package org.example.backend.enums;

public enum TaskStatus {
  PENDING("대기"),
  ACCEPTED("수락"),
  DENIED("거절");

  private final String description;

  // 생성자 (Singleton)
  TaskStatus(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
