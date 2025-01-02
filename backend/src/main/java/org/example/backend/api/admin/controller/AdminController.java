package org.example.backend.api.admin.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.admin.service.AdminService;
import org.example.backend.api.user.model.dto.RequestDetailDto;
import org.example.backend.api.user.model.dto.AdminResponseDto;
import org.example.backend.api.user.model.dto.UserLoginDto;
import org.example.backend.api.user.model.dto.UserLoginResponse;
import org.example.backend.api.user.service.UserService;
import org.example.backend.exceptions.LoginFailedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    private final UserService userService;
    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        try {
            log.info("login email: {}", userLoginDto.getUserEmail());
            log.info("login password: {}", userLoginDto.getUserPassword());

            UserLoginResponse login = userService.login(userLoginDto, response);
            return ResponseEntity.status(HttpStatus.OK).body(login);
        } catch (LoginFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
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

        String userEmail = authentication.getName();

        try {
            // 로그아웃 처리
            userService.logout(token, userEmail, response);
            return ResponseEntity.status(HttpStatus.OK).body("로그아웃되었습니다.");
        } catch (Exception e) {
            // 잘못된 토큰이나 사용자 정보가 없는 경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그아웃 실패: " + e.getMessage());
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getRequestList() {
        // TODO: admin only
        // 요청 목록 조회
        List<RequestDetailDto> allRequests = adminService.findAllRequests();
        return ResponseEntity.status(HttpStatus.OK).body(allRequests);
    }

    @GetMapping("/requests/{requestId}")
    public ResponseEntity<?> getRequestDetail(@PathVariable("requestId") Long requestId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(adminService.findAnyRequest(requestId));
        } catch(UserNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 요청입니다.");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("요청 조회 중 오류가 발생했습니다.");
        }
    }

    @PatchMapping("/requests/{requestId}")
    public ResponseEntity<?> updateRequestStatus(@PathVariable("requestId") Long requestId,
                                                 @RequestBody AdminResponseDto adminResponseDto) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(adminService.updateRequestStatus(requestId, adminResponseDto));
        } catch(UserNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 요청입니다.");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("요청 처리 중 오류가 발생했습니다.");
        }
    }
}
