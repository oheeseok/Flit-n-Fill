package org.example.backend.enums;

public enum KindnessType {
  GREAT(100, "좋아요"),
  AVERAGE(60, "보통이에요"),
  BAD(30, "별로에요");

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

  // 특정 점수에 해당하는 FeedbackType 찾기
  public static KindnessType fromScore(int score) {
    for (KindnessType type : KindnessType.values()) {
      if (type.getScore() == score) {
        return type;
      }
    }
    throw new IllegalArgumentException("Invalid score: " + score);
  }
}
