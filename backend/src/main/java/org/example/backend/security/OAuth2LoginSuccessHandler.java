package org.example.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.api.user.service.TokenManagementService;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final TokenManagementService tokenManagementService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userEmail = principalDetails.getUsername();
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        // Access Token 및 Refresh Token 가져오기;
        // Access Token 및 Refresh Token 가져오기
//        String accessToken = principalDetails.getAccessToken();
//        String refreshToken = principalDetails.getRefreshToken();
//        log.info("User {} authenticated successfully.", principalDetails.getUsername());
//
////        // 토큰을 HTTP 응답 헤더에 추가
////        response.setHeader("Authorization", "Bearer " + accessToken);
////        response.setHeader("Refresh-Token", refreshToken);
//        // 쿠키에 토큰 저장 (Access Token)
//        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
//        accessTokenCookie.setHttpOnly(true); // JavaScript에서 접근 불가
//        accessTokenCookie.setSecure(false); // HTTPS 연결에서만 전송
//        accessTokenCookie.setPath("/"); // 모든 경로에서 접근 가능
//        accessTokenCookie.setMaxAge(3600); // 쿠키 만료 시간 (1시간)
//
//        // 쿠키에 Refresh Token 저장
//        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setSecure(false);
//        refreshTokenCookie.setPath("/");
//        refreshTokenCookie.setMaxAge(3600); // 1시간
//
//        // 응답에 쿠키 추가
//        response.addCookie(accessTokenCookie);
//        response.addCookie(refreshTokenCookie);

        tokenManagementService.handleSuccessfulLogin(user, response);
        // 메인 페이지로 리디렉션
        response.sendRedirect("/api/recipes");
    }
}
