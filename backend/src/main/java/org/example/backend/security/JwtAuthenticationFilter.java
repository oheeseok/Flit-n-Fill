package org.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // 제외할 URL 패턴
        if (requestURI.startsWith("/api/user/register") || requestURI.startsWith("/api/user/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 제거

            if (jwtTokenProvider.isTokenExpired(token)) {
                log.warn("[JwtAuthenticationFilter] Token expired for user: {}", request.getHeader("Authorization"));
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token expired");
                return;
            }

            try {
                String userEmail = jwtTokenProvider.validateToken(token); // JWT 검증
                Long userId = jwtTokenProvider.getUserIdFromToken(token);
//                log.info("[JwtAuthenticationFilter] 회원 이메일: {}, 회원 ID: {}", userEmail, userId);
                // 사용자 인증 처리 (인증 정보 설정)
                request.setAttribute("userEmail", userEmail); // 사용자 정보를 request에 설정
                request.setAttribute("userId", userId);
                log.info("[JwtAuthenticationFilter] userEmail: {}, userId: {}", request.getAttribute("userEmail"), request.getAttribute("userId"));

                // spring security 인증 정보 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userEmail, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                log.error("[JwtAuthenticationFilter] Token validation error", e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized");
                return;
            }
        }

        filterChain.doFilter(request, response); // 다음 필터로 전달
    }
}
