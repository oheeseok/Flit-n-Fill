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
public class PostSimpleDto {
    private Long postId;
    private String postTitle;
    private String postPhoto1;
    private TradeType tradeType;
    private LocalDateTime postCreatedDate;
    private String userNickname;
    private String userProfile;
    private String address;
    private Progress progress;
    private String postContent;
    private String userEmail;

    public static PostSimpleDto of(Post post, User user) {
        PostSimpleDto dto = new PostSimpleDto();
        dto.setPostId(post.getPostId());
        dto.setPostTitle(post.getPostTitle());
        dto.setPostPhoto1(post.getPostPhoto1());
        dto.setTradeType(post.getTradeType());
        dto.setPostCreatedDate(post.getPostCreatedDate());
        dto.setAddress(post.getAddress());
        dto.setProgress(post.getProgress());
        dto.setPostContent(post.getPostContent());

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
