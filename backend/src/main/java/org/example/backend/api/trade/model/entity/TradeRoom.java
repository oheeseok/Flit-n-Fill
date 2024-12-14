package org.example.backend.api.trade.model.entity;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.trade.model.dto.TradeRoomMessageDto;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "traderoom")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TradeRoom {
  @Id
  private String tradeRoomId; // MongoDB의 기본 키

  @NotNull
  private LocalDateTime tradeRoomCreatedDate;

  @NotNull
  private Long tradeId;

  @NotNull
  private List<TradeRoomMessageDto> tradeRoomMessage;

  private Long writerId;
  private Long proposerId;
}
