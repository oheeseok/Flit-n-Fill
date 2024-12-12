package org.example.backend.api.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TradeRoomMessageDto {
  private LocalDateTime time;
  private Long userId;
  private String comment;
}
