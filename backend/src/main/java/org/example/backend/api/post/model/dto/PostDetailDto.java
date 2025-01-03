package org.example.backend.api.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.post.model.entity.Post;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.Progress;
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
    private Long writerFoodId;
    private Long proposerFoodListId;
    private String userNickname;
    private String userProfile;
    private String address;
    private Progress progress;
    private String userEmail;
    private String writerFoodName;
    private String proposerFoodName;

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
        dto.setWriterFoodId(post.getWriterFood().getFoodId());
        dto.setProposerFoodListId(post.getProposerFoodList() != null ? post.getProposerFoodList().getFoodListId() : null);
        dto.setWriterFoodName(post.getWriterFood() != null ? post.getWriterFood().getFoodListName() : null);
        dto.setProposerFoodName(post.getProposerFoodList() != null
                ? (post.getProposerFoodList().getFoodListType() != null
                        ? post.getProposerFoodList().getFoodListType()
                        : post.getProposerFoodList().getFoodListProduct())
                : null);
        dto.setAddress(post.getAddress());
        dto.setProgress(post.getProgress());

        if (user != null) {
            dto.setUserNickname(user.getUserNickname());
            dto.setUserProfile(user.getUserProfile());
            dto.setUserEmail(user.getUserEmail());
        } else {
            dto.setUserNickname(null);
            dto.setUserProfile(null);
            dto.setUserEmail(null);
        }
        return dto;
    }
}
