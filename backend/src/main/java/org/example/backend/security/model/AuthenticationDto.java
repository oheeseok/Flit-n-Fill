package org.example.backend.security.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
public class AuthenticationDto {
    private boolean isAuthenticated;
    private boolean isBlacked;
    private LocalDateTime expirationDate;
}
