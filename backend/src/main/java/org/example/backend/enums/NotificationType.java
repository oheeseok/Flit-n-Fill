package org.example.backend.enums;

public enum NotificationType {
  EXPIRATION("소비기한"),
  TRADE_REQUEST("교환 요청"),
  SHARE_REQUEST("나눔 요청"),
  TRADE_REQUEST_RESULT("교환 요청 결과"),
  SHARE_REQUEST_RESULT("나눔 요청 결과"),
  TRADE_CANCEL("교환 취소"),
  SHARE_CANCEL("나눔 취소"),
  FOOD_REQUEST_RESULT("재료 추가 요청 결과"),
  REPORT_AGAINST_ME("신고 당함"),
  REPORT_RESULT("신고 결과"),
  NEW_COMMENT("새 댓글"),
  LEVEL_CHANGE("레벨 변동");

  private final String description;

  // 생성자 (Singleton)
  NotificationType(String description) {
    this.description = description;
  }

  // Getter
  public String getDescription() {
    return description;
  }
}
