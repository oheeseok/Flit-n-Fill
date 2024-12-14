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
public class PostSimpleDto {
    private Long postId;
    private String postTitle;
    private String postPhoto1;
    private TradeType tradeType;
    private LocalDateTime postCreatedDate;
    private String userNickname;
    private String userProfile;
    private String address;
}
