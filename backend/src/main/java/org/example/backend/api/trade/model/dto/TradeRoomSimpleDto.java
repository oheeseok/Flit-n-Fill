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
public class TradeRoomSimpleDto {
    private String tradeRoomId;
    private String postTitle;
    private String otherUserNickname;
    private String otherUserProfile;
    private LocalDateTime lastMessageTime;
}
