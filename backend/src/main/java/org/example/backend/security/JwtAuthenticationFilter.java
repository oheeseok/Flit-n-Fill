package org.example.backend.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.service.TokenManagementService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenManagementService tokenManagementService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.info("[JwtAuthenticationFilter] request URI: {}", requestURI);

        // 제외할 URL 패턴
        if (requestURI.startsWith("/api/user/register") || requestURI.startsWith("/api/user/login")
                || requestURI.startsWith("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 쿠키에서 토큰 가져오기
        Cookie[] cookies = request.getCookies();
        String token = null;
        String userEmail = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                } else if ("userEmail".equals(cookie.getName())) {
                    userEmail = cookie.getValue();
                }

                if (token != null && userEmail != null) {
                    break;
                }
            }
        }

//        String token = request.getHeader("Authorization");
        log.info("[JwtAuthenticationFilter] cookie accessToken : {}", token);

        if (token != null && userEmail != null) {
            try {
                token = tokenManagementService.isTokenExpired(userEmail, token, response);
                if (token == null) {
//                    response.sendRedirect("/login"); // 로그인 페이지로 리다이렉션
                    return;
                }

                Long userId = Long.parseLong((jwtTokenProvider.validateToken(token)));
//                log.info("[JwtAuthenticationFilter] 회원 이메일: {}, 회원 ID: {}", userEmail, userId);
                // 사용자 인증 처리 (인증 정보 설정)
                request.setAttribute("userEmail", userEmail); // 사용자 정보를 request에 설정
                request.setAttribute("userId", userId);
                log.info("[JwtAuthenticationFilter] userEmail: {}, userId: {}", request.getAttribute("userEmail"), request.getAttribute("userId"));

                // spring security 인증 정보 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userEmail, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (ExpiredJwtException e) {
                log.error("[JwtAuthenticationFilter] Expired JWT token", e);
                response.sendRedirect("/login"); // 로그인 페이지로 리다이렉션
                return;
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
