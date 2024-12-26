package org.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Long> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Long> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);

        // String 타입의 키와 Long 타입의 값을 저장하기 위해 각 Serializer를 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer()); // 키는 String
        redisTemplate.setValueSerializer(new GenericToStringSerializer<>(Long.class)); // 값은 Long

        return redisTemplate;
    }

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setHostName("redis-container");  // Docker 네트워크 상의 Redis 컨테이너 이름
        configuration.setPort(6379);  // Redis 포트
        return new LettuceConnectionFactory(configuration);
    }
}
