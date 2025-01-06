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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TokenManagementService {

    private final RedisTemplate<String, Long> redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${server.host}")
    private String host;

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

        // access token, userEmail
        addCookie(response, "userEmail", user.getUserEmail());
        addCookie(response, "accessToken", accessToken);

        boolean isBlacked = false;
        LocalDateTime blacklistExp = isBlacklistUser(user.getUserEmail());
        if (blacklistExp != null) {
            isBlacked = true;
        }

        return new UserLoginResponse(accessToken, refreshToken,
                user.getUserEmail(), user.getUserProfile(),
                user.getUserNickname(), user.getUserKindness(),
                isBlacked, blacklistExp, user.getRole());
    }


    // 쿠키 추가
    private void addCookie(HttpServletResponse response, String cookieName, String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7일
        response.addCookie(cookie);

        // SameSite=None 속성을 응답 헤더로 추가
        String headerValue = String.format("%s=%s; Path=%s; HttpOnly; Secure; SameSite=None",
                cookie.getName(),
                cookie.getValue(),
                cookie.getPath()
        );
        response.addHeader("Set-Cookie", headerValue);
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

        // access token
        Long expirationTime = ops.get("Blacklist:" + token);

        if (expirationTime != null) {
            response.sendRedirect("https://" + host);
            return null; // 로그아웃 된 토큰은 login으로 리다이렉팅
        }

        if (jwtTokenProvider.isTokenExpired(token)) {
            if (jwtTokenProvider.isTokenExpired(refreshToken)) {
                // access token, refresh token 모두 만료된 경우
                log.info("둘다 만료");
                clearCookie(response, "accessToken");
                clearCookie(response, "userEmail");
                response.sendRedirect("https://" + host);
                return null;
            } else {
                // refresh token 이 만료되지 않은 경우
                // access token 갱신
                token = jwtTokenProvider.generateAccessToken(userEmail, user.getUserId());
                addCookie(response, "accessToken", token);
            }
        } else if (jwtTokenProvider.isTokenExpired(refreshToken)) {
            // refresh token 이 만료된 경우
            user.setRefreshToken(jwtTokenProvider.generateRefreshToken(userEmail, user.getUserId()));
            userRepository.save(user);
        }
        return token; // access token 반환
    }

    // 토큰을 블랙리스트에 추가 (만료 시간과 함께 저장)
    public void addBlacklistToken(String token, long expirationTime, HttpServletResponse response) {
        log.info("만료시킬토큰: {}", token);
        log.info("넘어온 만료기한: {}", expirationTime);
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();

        // Redis에 토큰과 만료 시간 저장, 만료 시간 설정 (만료된 후 자동 삭제)
        if (expirationTime != 0) {
            ops.set("Blacklist:" + token, expirationTime, expirationTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
        }
        clearCookie(response, "accessToken");
        clearCookie(response, "userEmail");
    }

    // 블랙유저 체크
    public LocalDateTime isBlacklistUser(String userEmail) {
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();
        Long expirationTime = ops.get("BlackUser:" + userEmail);

        if (expirationTime != null) {
            return LocalDateTime.ofInstant(Instant.ofEpochMilli(expirationTime), ZoneId.systemDefault());
        };
        return null;
    }
}