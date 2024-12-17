package org.example.backend.api.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.FoodUnit;
import org.example.backend.enums.TradeType;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostRegisterDto {
    private String postContent;
    private String meetingPlace;
    private LocalDateTime meetingTime;
    private String postPhoto1;
    private String postPhoto2;
    private TradeType tradeType;
    private Long writerFoodId;
    private Long proposerFoodListId;
}
