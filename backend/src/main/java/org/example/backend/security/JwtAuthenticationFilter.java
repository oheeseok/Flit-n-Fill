package org.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.service.TokenBlacklistService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlaclistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.info("[JwtAuthenticationFilter] request URI: {}", requestURI);

        // 제외할 URL 패턴
        if (requestURI.startsWith("/api/user/register") || requestURI.startsWith("/api/user/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 쿠키에서 토큰 가져오기
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

//        String token = request.getHeader("Authorization");
        log.info("[JwtAuthenticationFilter] cookie accessToken : {}", token);

        if (token != null) {
//            token = token.substring(7); // "Bearer " 제거

            if (jwtTokenProvider.isTokenExpired(token)) {
//                log.warn("[JwtAuthenticationFilter] Token expired for user: {}", jwtTokenProvider.getUserEmailFromToken(token));
                // 만료된 쿠키 삭제
                clearCookie(response, "accessToken");

                response.sendRedirect("/login"); // 로그인 페이지로 리다이렉션
//
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().write("Token expired");
                return;
            }

            if (tokenBlaclistService.isTokenExpired(token)) {
                // 만료된 쿠키 삭제
                clearCookie(response, "accessToken");

                response.sendRedirect("/login"); // 로그인 페이지로 리다이렉션
//
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().write("Token is blocked");
                return;
            }

            try {
                String userEmail = jwtTokenProvider.getUserEmailFromToken(token); // JWT 검증
                Long userId = Long.parseLong((jwtTokenProvider.validateToken(token)));
//                log.info("[JwtAuthenticationFilter] 회원 이메일: {}, 회원 ID: {}", userEmail, userId);
                // 사용자 인증 처리 (인증 정보 설정)
                request.setAttribute("userEmail", userEmail); // 사용자 정보를 request에 설정
                request.setAttribute("userId", userId);
                log.info("[JwtAuthenticationFilter] userEmail: {}, userId: {}", request.getAttribute("userEmail"), request.getAttribute("userId"));

                // spring security 인증 정보 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userEmail,null, new ArrayList<>());
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

    /**
     * 쿠키 삭제 메서드
     */
    private void clearCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, null); // 빈 값으로 설정
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); // 즉시 만료
        cookie.setPath("/"); // 경로 지정
        response.addCookie(cookie);
        log.info("[JwtAuthenticationFilter] Cookie cleared: {}", cookieName);
    }
}
