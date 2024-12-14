package org.example.backend.api.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private double userKindness;
}
