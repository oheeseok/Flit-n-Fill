package org.example.backend.api.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.enums.Role;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginResponse {
    private String accessToken;
    private String refreshToken;
    private String userEmail;
    private String userProfile;
    private String userNickname;
    private int userKindness;
    private boolean isBlacked;
    private LocalDateTime blacklistExpiryDate;
    private Role role;
}
