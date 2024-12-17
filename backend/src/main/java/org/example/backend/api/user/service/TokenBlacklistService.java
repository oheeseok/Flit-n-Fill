package org.example.backend.api.user.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TokenBlacklistService {

    private final RedisTemplate<String, Long> redisTemplate;

    public TokenBlacklistService(RedisTemplate<String, Long> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // 토큰 블랙리스트에 토큰이 만료되었는지 확인
    public boolean isTokenExpired(String token) {
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();

        Long expirationTime = ops.get(token);

        if (expirationTime == null) {
            return false; // 블랙리스트에 없으면 만료되지 않은 것과 동일
        }

        // 현재 시간이 만료 시간 초과한 경우
        // ttl 설정 실패, 시간 지연, 시간 동기화 문제 등을 대비하여 명시적 삭제 처리
        if (System.currentTimeMillis() > expirationTime) {
            // 만료된 토큰은 Redis에서 제거
            redisTemplate.delete(token);
            return false;
        }

        return true;
    }

    // 토큰을 블랙리스트에 추가 (만료 시간과 함께 저장)
    public void addBlacklistToken(String token, long expirationTime) {
        log.info("만료시킬토큰: {}", token);
        log.info("넘어온 만료기한: {}", expirationTime);
        ValueOperations<String, Long> ops = redisTemplate.opsForValue();

        // Redis에 토큰과 만료 시간 저장, 만료 시간 설정 (만료된 후 자동 삭제)
        ops.set(token, expirationTime, expirationTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }
}