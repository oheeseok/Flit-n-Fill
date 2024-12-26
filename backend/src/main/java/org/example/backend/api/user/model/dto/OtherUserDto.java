package org.example.backend.api.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.user.model.entity.User;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OtherUserDto {
    private Long userId;
    private String userNickname;
    private String userAddress;
    private String userProfile;
    private int userKindness;

    public static OtherUserDto of(User user) {
        return new OtherUserDto(
                user.getUserId(),
                user.getUserNickname(),
                user.getUserAddress(),
                user.getUserProfile(),
                user.getUserKindness()
        );
    }
}
