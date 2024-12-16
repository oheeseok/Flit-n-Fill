package org.example.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect // AOP
@Component
@Slf4j
public class JwtAuthenticationAspect {
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationAspect(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Before("@annotation(org.example.backend.security.Authenticate)")  // @Authenticate가 붙은 메서드 실행 전에
    public void authenticate(JoinPoint joinPoint) {
        // HttpServletRequest를 JoinPoint에서 가져오기
        Object[] args = joinPoint.getArgs();
        HttpServletRequest request = null;

        // 메서드 파라미터 중 HttpServletRequest를 찾음
        for (Object arg : args) {
            if (arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
                break;
            }
        }

        if (request == null) {
            throw new RuntimeException("HttpServletRequest not found");
        }

        // userEmail이 없으면 예외 발생
        String userEmail = (String) request.getAttribute("userEmail");
        log.info("[JwtAuthenticationAspect] userEmail: {}", userEmail);
        if (userEmail == null) {
            throw new RuntimeException("Unauthorized access");
        }
    }
}
