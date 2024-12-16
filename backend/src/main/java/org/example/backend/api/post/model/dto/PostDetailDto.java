package org.example.backend.api.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.user.model.entity.User;
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

    public static PostDetailDto of(Post post, User user) {
        PostDetailDto dto = new PostDetailDto();
        dto.setPostId(post.getPostId());
        dto.setPostTitle(post.getPostTitle());
        dto.setPostContent(post.getPostContent());
        dto.setPostCreatedDate(post.getPostCreatedDate());
        dto.setMeetingPlace(post.getMeetingPlace());
        dto.setMeetingTime(post.getMeetingTime());
        dto.setPostPhoto1(post.getPostPhoto1());
        dto.setPostPhoto2(post.getPostPhoto2());
        dto.setTradeType(post.getTradeType());
        dto.setWriterFood(post.getWriterFood());
        dto.setWriterCount(post.getWriterCount());
        dto.setWriterUnit(post.getWriterUnit());
        dto.setProposerFood(post.getProposerFood());
        dto.setProposerCount(post.getProposerCount());
        dto.setProposerUnit(post.getProposerUnit());
        dto.setAddress(post.getAddress());

        if (user != null) {
            dto.setUserNickname(user.getUserNickname());
            dto.setUserProfile(user.getUserProfile());
        } else {
            dto.setUserNickname(null);
            dto.setUserProfile(null);
        }
        return dto;
    }
}
