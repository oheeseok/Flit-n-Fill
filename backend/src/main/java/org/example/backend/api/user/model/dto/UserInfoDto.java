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
public class UserInfoDto {
    private String userName;
    private String userEmail;
    private String userNickname;
    private String userPhone;
    private String userAddress;
    private String userProfile;
    private int userKindness;

    public static UserInfoDto of(User user) {
        return new UserInfoDto(
                user.getUserName(),
                user.getUserEmail(),
                user.getUserNickname(),
                user.getUserPhone(),
                user.getUserAddress(),
                user.getUserProfile(),
                user.getUserKindness()
        );
    }
}
