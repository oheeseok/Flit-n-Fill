package org.example.backend.api.user.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.model.dto.UserLoginResponse;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserIdNullException;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.security.JwtTokenProvider;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TokenManagementService {

    private final RedisTemplate<String, Long> redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public TokenManagementService(RedisTemplate<String, Long> redisTemplate, JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.redisTemplate = redisTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    // 로그인 성공 시 토큰 발급 및 쿠기 설정
    public UserLoginResponse handleSuccessfulLogin(User user, HttpServletResponse response) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getUserEmail(), user.getUserId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUserEmail(), user.getUserId());

        // 로그인 성공 시 refresh token 재발급
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // access token, refresh token 쿠키 설정
        addCookie(response, "userEmail", user.getUserEmail());
        addCookie(response, "accessToken", accessToken);
        addCookie(response, "refreshToken", refreshToken);

        return new UserLoginResponse(accessToken, refreshToken);
    }

    // 쿠키 추가
    private void addCookie(HttpServletResponse response, String cookieName, String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7일
        response.addCookie(cookie);
    }

    // 쿠기 삭제
    private void clearCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, null); // 빈 값으로 설정
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // 즉시 만료
        cookie.setPath("/"); // 경로 지정
        response.addCookie(cookie);
        log.info("[JwtAuthenticationFilter] Cookie cleared: {}", cookieName);
    }

    // 토큰이 만료되었는지 확인
    // 1. 로그아웃 여부 확인
    // 2. 토큰 자체 만료 확인
    // 3. 만료되었으나 refresh toekn 이 살아있는 경우 확인
    public String isTokenExpired(String userEmail, String token, HttpServletResponse response) throws IOException {
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();

        if (userEmail == null) {
            throw new UnauthorizedException("유효하지 않은 액세스 토큰입니다.");
        }
        // user refresh token 가져오기
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("존재하지 않는 회원입니다."));
        String refreshToken = user.getRefreshToken();
        log.info("refresh token : {}", refreshToken);

        if (jwtTokenProvider.isTokenExpired(token)) {
            if (jwtTokenProvider.isTokenExpired(refreshToken)) {
                // access token, refresh token 모두 만료된 경우
                log.info("둘다 만료");
                clearCookie(response, "accessToken");
                clearCookie(response, "refreshToken");
                response.sendRedirect("/login");
                return null;
            } else {
                // refresh token 이 만료되지 않은 경우
                // access token 갱신
                String accessToken = jwtTokenProvider.generateAccessToken(userEmail, user.getUserId());
                addCookie(response, "accessToken", accessToken);
                return accessToken;
            }
        }

        // access token
        Long expirationTime = ops.get("Blacklist:" + token);

        if (expirationTime == null) {
            return token; // 블랙리스트에 없으면 만료되지 않은 것과 동일
        }
        // 현재 시간이 만료 시간 초과한 경우
        // ttl 설정 실패, 시간 지연, 시간 동기화 문제 등을 대비하여 명시적 삭제 처리
//        if (System.currentTimeMillis() > expirationTime) {
//            // 만료된 토큰은 Redis에서 제거
//            redisTemplate.delete(token);
//            return token;
//        }

        // 로그아웃된 토큰이므로 true 반환
        response.sendRedirect("/login");
        return null;
    }

    // 토큰을 블랙리스트에 추가 (만료 시간과 함께 저장)
    public void addBlacklistToken(String token, long expirationTime, HttpServletResponse response) {
        log.info("만료시킬토큰: {}", token);
        log.info("넘어온 만료기한: {}", expirationTime);
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();

        // Redis에 토큰과 만료 시간 저장, 만료 시간 설정 (만료된 후 자동 삭제)
        ops.set("Blacklist:" + token, expirationTime, expirationTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
        clearCookie(response, "accessToken");
        clearCookie(response, "refreshToken");
    }
}