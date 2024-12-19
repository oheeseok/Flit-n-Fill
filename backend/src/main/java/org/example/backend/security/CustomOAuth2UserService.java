package org.example.backend.security;

import jakarta.security.auth.message.AuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("OAuth2UserRequest: {}", userRequest);
        log.info("Client Registration: {}", userRequest.getClientRegistration());
        // 유저 정보(attribute) 가져오기
        Map<String, Object> oAuthUserAttributes = super.loadUser(userRequest).getAttributes();
        log.info("OAuth2UserAttributes: {}", oAuthUserAttributes);

        // registrationId 가져오기 (third-party id)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("RegistrationId: " + registrationId);

        OAuth2UserInfo oAuth2UserInfo;
        try {
            oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuthUserAttributes);
        } catch (AuthException e) {
            log.error("Failed to parse OAuth2UserInfo", e);
            throw new OAuth2AuthenticationException("Failed to process OAuth2 user information");
        }

        // 사용자 이메일
        String userEmail = oAuth2UserInfo.email();
        log.info("userEmail: {}", userEmail);

        // DB에서 userEmail, userNickname, userProfileUrl, registrationId, attributes (third-party id)로 사용자 ��기
        User user = userRepository.findByUserEmail(userEmail)
                .orElseGet(() -> registerNewUser(oAuthUserAttributes, registrationId));
        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getUserEmail(), user.getUserId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserEmail(), user.getUserId());

        // Refresh Token DB 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // JWT를 PrincipalDetails 객체에 추가
        return new PrincipalDetails(user, oAuthUserAttributes, accessToken, refreshToken);
    }

    // 새로운 사용자 등록
    private User registerNewUser(Map<String, Object> attributes, String registrationId) {
        // OAuth2UserInfo 에서 userEmail, userNickname, userProfileUrl, registrationId, attributes (third-party id)를 추출

        try {
            OAuth2UserInfo userInfo = OAuth2UserInfo.of(registrationId, attributes);

            return userRepository.save(userInfo.toEntity());
        } catch (AuthException e) {
            throw new OAuth2AuthenticationException("Failed to register new user by social account.");
        }
    }
}
