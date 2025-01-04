package org.example.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.model.dto.UserLoginResponse;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.api.user.service.TokenManagementService;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.security.model.PrincipalDetails;
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

        UserLoginResponse userLoginResponse = tokenManagementService.handleSuccessfulLogin(user, response);

        String accessToken = userLoginResponse.getAccessToken();
        // 메인 페이지로 리디렉션
        response.sendRedirect("http://www.flitnfill.kro.kr/signin?socialtoken="+accessToken);
//        response.sendRedirect("http://localhost:5173/signin?socialtoken="+accessToken);
    }
}
