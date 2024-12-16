package org.example.backend.api.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.service.RecipeService;
import org.example.backend.api.user.model.dto.UserLoginDto;
import org.example.backend.api.user.model.dto.UserLoginResponse;
import org.example.backend.api.user.model.dto.UserRegisterDto;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.LoginFailedException;
import org.example.backend.security.JwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RecipeService recipeService;

    // userEmail 중복 검사
    public boolean existsByUserEmail(String userEmail) {
        return userRepository.existsByUserEmail(userEmail);
    }

    // userNickname 중복 검사
    public boolean existsByUserNickname(String userNickname) {
        return userRepository.existsByUserNickname(userNickname);
    }

    // 회원 가입
    public void registerUser(UserRegisterDto userRegisterDto) {
        User user = new User(
                userRegisterDto.getUserName(),
                userRegisterDto.getUserEmail(),
                userRegisterDto.getUserNickname(),
                userRegisterDto.getUserPassword(),
                userRegisterDto.getUserPhone(),
                userRegisterDto.getUserAddress(),
                "default profile url",
                0
        );
        userRepository.save(user);
    }

    // 로그인
    public UserLoginResponse login(UserLoginDto userLoginDto) {
        String email = userLoginDto.getUserEmail();
        String password = userLoginDto.getUserPassword();

        // 사용자 존재 여부 확인
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new LoginFailedException("아이디 또는 비밀번호가 잘못되었습니다."));

        // 비밀번호 검증
        if (!user.getUserPassword().equals(password)) {
            throw new LoginFailedException("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        Long userId = user.getUserId();

        // JWT token 생성
        String accessToken = jwtTokenProvider.generateAccessToken(email, userId);
        String refreshToken = jwtTokenProvider.generateRefreshToken(email, userId);

        // Refresh Token을 DB에 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // UserLoginResponse 반환
        return new UserLoginResponse(accessToken, refreshToken);
    }

    public void logout(String token) {
        // 토큰에서 사용자 이메일 추출
        String userEmail = jwtTokenProvider.validateToken(token);

        if (userEmail == null) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // DB에서 사용자 조회
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // Refresh Token 삭제
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        // 사용자를 삭제하기 전에 Recipe의 userId를 null로 설정
        recipeService.setRecipesUserIdToNull(userId);
        // 사용자 삭제
        userRepository.deleteById(userId);
    }


}
