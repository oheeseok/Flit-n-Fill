package org.example.backend.security.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.security.model.AuthenticationDto;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RedisTemplate<String, Long> redisTemplate;

    public AuthenticationDto checkAuthentication(String userEmail) {
        LocalDateTime blacklistUser = isBlacklistUser(userEmail);
        AuthenticationDto auth = new AuthenticationDto();
        auth.setAuthenticated(true);
        if (blacklistUser != null) {
            auth.setBlacked(true);
            auth.setExpirationDate(blacklistUser);
        } else {
            auth.setBlacked(false);
            auth.setExpirationDate(null);
        }

        return auth;
    }

    // 블랙유저 체크
    private LocalDateTime isBlacklistUser(String userEmail) {
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();
        Long expirationTime = ops.get("BlackUser:" + userEmail);

        if (expirationTime != null) {
            return LocalDateTime.ofInstant(Instant.ofEpochMilli(expirationTime), ZoneId.systemDefault());
        };
        return null;
    }
}
