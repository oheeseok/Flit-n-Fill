package org.example.backend.enums;

public enum KindnessType {
  GREAT(10, "좋아요"),
  BAD(-5, "별로예요");

  private final int score;
  private final String description;

  // 생성자
  KindnessType(int score, String description) {
    this.score = score;
    this.description = description;
  }

  // Getter 메서드
  public int getScore() {
    return score;
  }

  public String getDescription() {
    return description;
  }
}
