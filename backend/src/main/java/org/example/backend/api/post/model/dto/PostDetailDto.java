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
public class PostDetailDto {
    private Long postId;
    private String postTitle;
    private String postContent;
    private LocalDateTime postCreatedDate;
    private String meetingPlace;
    private LocalDateTime meetingTime;
    private String postPhoto1;
    private String postPhoto2;
    private TradeType tradeType;
    private String writerFood;
    private int writerCount;
    private FoodUnit writerUnit;
    private String proposerFood;
    private int proposerCount;
    private FoodUnit proposerUnit;
    private String userNickname;
    private String userProfile;
    private String address;
}