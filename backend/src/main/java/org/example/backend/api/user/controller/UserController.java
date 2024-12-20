package org.example.backend.api.user.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.user.model.dto.*;
import org.example.backend.api.user.service.UserService;
import org.example.backend.exceptions.LoginFailedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegisterDto userRegisterDto) {
        if (userService.existsByUserEmail(userRegisterDto.getUserEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 가입된 이메일입니다.");
        }

        if (userService.existsByUserNickname(userRegisterDto.getUserNickname())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용중인 닉네임입니다.");
        }

        userService.registerUser(userRegisterDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("가입을 축하합니다!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        try {
            UserLoginResponse login = userService.login(userLoginDto);
            // 쿠키에 토큰 저장 (Access Token)
            Cookie accessTokenCookie = new Cookie("accessToken", login.getAccessToken());
            accessTokenCookie.setHttpOnly(true); // JavaScript에서 접근 불가
            accessTokenCookie.setSecure(false); // HTTPS 연결에서만 전송
            accessTokenCookie.setPath("/"); // 모든 경로에서 접근 가능
            accessTokenCookie.setMaxAge(3600); // 쿠키 만료 시간 (1시간)

            // 쿠키에 Refresh Token 저장
            Cookie refreshTokenCookie = new Cookie("refreshToken", login.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(false);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(3600); // 1시간

            // 응답에 쿠키 추가
            response.addCookie(accessTokenCookie);
            response.addCookie(refreshTokenCookie);

            return ResponseEntity.status(HttpStatus.OK).body("로그인에 성공하였습니다.");
        } catch (LoginFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        String userEmail = (String) request.getAttribute("userEmail");
        log.info(userEmail);

        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserInfoByEmail(userEmail));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 조회 중 오류가 발생했습니다.");
        }
    }

    @PutMapping("/info")
    public ResponseEntity<?> updateUserInfo(HttpServletRequest request, @RequestBody UserUpdateDto updateDto) throws Exception {
        String userEmail = (String) request.getAttribute("userEmail");
        log.info("logined email: {}", userEmail);

        if (userService.existsByUserNickname(updateDto.getUserNickname())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용중인 닉네임입니다.");
        }

        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.updateUserInfo(userEmail, updateDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable("userId") Long userId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getOtherUserInfo(userId));
        } catch(UserNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 회원입니다.");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 조회 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
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

        if (token == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 토큰입니다.");
        }
        try {
            // 로그아웃 처리
            userService.logout(token);
            return ResponseEntity.ok("로그아웃되었습니다.");
        } catch (Exception e) {
            // 잘못된 토큰이나 사용자 정보가 없는 경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그아웃 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/info")
    public ResponseEntity<String> deleteUser(HttpServletRequest request, @RequestBody UserLoginDto loginDto) {
        loginDto.setUserEmail((String) request.getAttribute("userEmail"));

        try {
            userService.deleteUserByUserEmail(loginDto);
            return ResponseEntity.status(HttpStatus.OK).body("회원 탈퇴 처리되었습니다.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 회원입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 중 오류가 발생했습니다.");
        }
    }
}
