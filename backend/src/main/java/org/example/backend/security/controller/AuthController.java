package org.example.backend.security.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.security.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        // TODO: JWT token validation
        String userEmail = request.getHeader("userEmail");
        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("authentication error");
        };

        return ResponseEntity.status(HttpStatus.OK).body(authService.checkAuthentication(userEmail));
    }
}
