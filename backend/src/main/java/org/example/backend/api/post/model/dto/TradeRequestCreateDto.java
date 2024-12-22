package org.example.backend.api.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.TradeType;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TradeRequestCreateDto {
    public Long postId;
    public TradeType tradeType;
    public Long proposerId;
    public String postUrl;
    public LocalDateTime requestCreatedTime;
}
