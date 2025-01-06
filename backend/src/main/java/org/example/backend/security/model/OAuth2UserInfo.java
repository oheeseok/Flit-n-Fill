package org.example.backend.security.model;

import jakarta.security.auth.message.AuthException;
import lombok.Builder;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.enums.AuthProvider;

import java.util.Map;

@Builder
public record OAuth2UserInfo(
        String name,
        String email,
        String profile,
        AuthProvider authProvider
) {

    private static final String PROFILE_DEFAULT_IMG_URL = "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/profile-default-img.jpg";

    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes) throws AuthException {
        return switch (registrationId) {
            case "google" -> ofGoogle(attributes);
            case "kakao" -> ofKakao(attributes);
            default -> throw new AuthException("registration id not supported");
        };
    }

    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes) {
        return OAuth2UserInfo.builder()
                .name((String)attributes.get("name"))
                .email((String) attributes.get("email"))
                .profile((String) attributes.get("picture"))
                .authProvider(AuthProvider.GOOGLE)
                .build();
    }

    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes) {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");

        return OAuth2UserInfo.builder()
                .name((String) profile.getOrDefault("nickname", "Unknown"))
                .email((String) account.getOrDefault("email", "unknown@kakao.com"))
                .profile((String) profile.getOrDefault("profile_image_url", ""))
                .authProvider(AuthProvider.KAKAO)
                .build();

    }

    public User toEntity() {
        User user = new User();
        user.setUserEmail(email);
        user.setUserName(name);
        user.setUserProfile(profile == null ? PROFILE_DEFAULT_IMG_URL : profile);
        user.setUserNickname(email.split("@")[0]);
        user.setAuthProvider(authProvider);
        user.setUserKindness(1);
        user.setUserExp(50);
        return user;
    }
}
