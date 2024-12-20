package org.example.backend.security;

import jakarta.security.auth.message.AuthException;
import lombok.Builder;
import org.example.backend.api.user.model.entity.User;

import java.util.Map;

@Builder
public record OAuth2UserInfo(
        String name,
        String email,
        String profile
) {

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
                .build();
    }

    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes) {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");

        return OAuth2UserInfo.builder()
                .name((String) profile.getOrDefault("nickname", "Unknown"))
                .email((String) account.getOrDefault("email", "unknown@kakao.com"))
                .profile((String) profile.getOrDefault("profile_image_url", ""))
                .build();

    }

    public User toEntity() {
        User user = new User();
        user.setUserEmail(email);
        user.setUserName(name);
        user.setUserProfile(profile);
        user.setUserEmail(email.split("@")[0]);
        return user;
    }
}
