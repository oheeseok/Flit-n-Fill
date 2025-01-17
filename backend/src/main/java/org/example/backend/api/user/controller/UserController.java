package org.example.backend.api.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.model.dto.RecipeSimpleDto;
import org.example.backend.api.recipe.service.RecipeService;
import org.example.backend.api.user.model.dto.*;
import org.example.backend.api.user.service.UserService;
import org.example.backend.exceptions.LoginFailedException;
import org.example.backend.exceptions.UserIdNullException;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.security.model.PrincipalDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final RecipeService recipeService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDto userRegisterDto) {
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
            log.info("login email: {}", userLoginDto.getUserEmail());
            UserLoginResponse login = userService.login(userLoginDto, response);

//            return ResponseEntity.status(HttpStatus.OK).body("로그인에 성공하였습니다.");
            return ResponseEntity.status(HttpStatus.OK).body(login);
        } catch (LoginFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/login/social")
    public ResponseEntity<?> logout(@RequestBody String socialToken, HttpServletResponse response) {
        // 토큰 검증 로직
        try {
            log.info("social token: " + socialToken);

            UserLoginResponse login = userService.socialLogin(socialToken, response);
            return ResponseEntity.status(HttpStatus.OK).body(login);
        } catch (LoginFailedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        String userEmail = authentication.getName();
//        log.info(userEmail);
        Object principal = authentication.getPrincipal();

        PrincipalDetails principalDetails = (PrincipalDetails) principal;
        log.info("principalDetails : {}", principalDetails.getUsername());
        log.info("principalDetails : {}", principalDetails.getUserId());
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getUserInfoByEmail(userEmail));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 조회 중 오류가 발생했습니다.");
        }
    }

    @PutMapping("/info")
    public ResponseEntity<?> updateUserInfo(Authentication authentication,
                                            @RequestPart("userUpdateDto") String updateDtoJson,
                                            @RequestPart(value = "userProfile", required = false) MultipartFile userProfile) throws Exception {
        String userEmail = authentication.getName();
        log.info("logined email: {}", userEmail);

        ObjectMapper objectMapper = new ObjectMapper();
        UserUpdateDto updateDto = objectMapper.readValue(updateDtoJson, UserUpdateDto.class);

        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.updateUserInfo(userEmail, updateDto, userProfile));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable("userId") Long userId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.getOtherUserInfo(userId));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 회원입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 조회 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String authorization = request.getHeader("Authorization");
        String token = null;
        if (authorization != null && authorization.startsWith("Bearer ")) {
            // "Bearer " 다음에 오는 토큰을 추출
            token = authorization.substring(7); // "Bearer "는 7글자
        }
        String userEmail = request.getHeader("userEmail");

        try {
            // 로그아웃 처리
            userService.logout(token, userEmail, response);

            return ResponseEntity.ok("로그아웃되었습니다.");
        } catch (Exception e) {
            // 잘못된 토큰이나 사용자 정보가 없는 경우
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그아웃 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/info")
    public ResponseEntity<?> deleteUser(Authentication authentication, @RequestBody UserLoginDto loginDto,
                                        HttpServletRequest request, HttpServletResponse response) {
        // 로그인 dto에서 로그인 email 받아오기) {
        String userEmail = authentication.getName();
        loginDto.setUserEmail(userEmail);

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

        try {
            userService.logout(token, userEmail, response);
            userService.deleteUserByUserEmail(loginDto);
            return ResponseEntity.status(HttpStatus.OK).body("회원 탈퇴 처리되었습니다.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 회원입니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 중 오류가 발생했습니다.");
        }
    }
    @PostMapping("/report")
    public ResponseEntity<?> reportUser(HttpServletRequest request, @RequestBody UserReportDto userReportDto) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        RequestDetailDto requestDetailDto = userService.reportUser(userId, userReportDto);
        return ResponseEntity.status(HttpStatus.OK).body(requestDetailDto);
    
    }
  
    @GetMapping("/my-recipes")
    public ResponseEntity<List<RecipeSimpleDto>> getMyRecipes(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(recipeService.getMyRecipes(userId));
    }

    @GetMapping("/bookmarked-recipes")
    public ResponseEntity<List<RecipeSimpleDto>> getBookmarkedRecipes(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new UserIdNullException("userId not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(recipeService.getBookmarkedRecipes(userId));
    }
}
