package org.example.backend.api.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TradeMessageAddDto {
    private Long userId;
    private String tradeRoomMessage;
}
