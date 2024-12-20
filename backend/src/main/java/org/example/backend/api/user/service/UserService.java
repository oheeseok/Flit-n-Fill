package org.example.backend.api.user.service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.api.recipe.service.RecipeService;
import org.example.backend.api.user.model.dto.*;
import org.example.backend.api.user.model.entity.User;
import org.example.backend.api.user.model.entity.UserCart;
import org.example.backend.api.user.repository.UserCartRepository;
import org.example.backend.api.user.repository.UserRepository;
import org.example.backend.exceptions.LoginFailedException;
import org.example.backend.exceptions.PasswordMismatchException;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final UserCartRepository userCartRepository;
    private final RecipeService recipeService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenManagementService tokenManagementService;

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
        String encodedPassword = passwordEncoder.encode(userRegisterDto.getUserPassword());

        User user = new User(
                userRegisterDto.getUserName(),
                userRegisterDto.getUserEmail(),
                userRegisterDto.getUserNickname(),
                encodedPassword, // 암호화된 비밀번호 사용
                userRegisterDto.getUserPhone(),
                userRegisterDto.getUserAddress(),
                "default profile url",
                0
        );
        userRepository.save(user);

        UserCart userCart = new UserCart();
        userCart.setUser(user);
        userCartRepository.save(userCart);
    }

    // 로그인
    public UserLoginResponse login(UserLoginDto userLoginDto, HttpServletResponse response) {
        String email = userLoginDto.getUserEmail();
        String password = userLoginDto.getUserPassword();

        // 사용자 존재 여부 확인
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new LoginFailedException("아이디 또는 비밀번호가 잘못되었습니다."));

        // 비밀번호 검증
        // if (!user.getUserPassword().equals(password)) {
        if (!passwordEncoder.matches(password, user.getUserPassword())) {
            throw new LoginFailedException("아이디 또는 비밀번호가 잘못되었습니다.");
        }

       return tokenManagementService.handleSuccessfulLogin(user, response);
    }

    public void logout(String token, HttpServletResponse response) {
        // 토큰에서 사용자 이메일 추출
        String userEmail = jwtTokenProvider.getUserEmailFromToken(token);

        if (userEmail == null) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // DB에서 사용자 조회
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // Refresh Token 삭제
        user.setRefreshToken(null);
        userRepository.save(user);

        // Access Token 블랙리스트에 추가
        long tokenExpiration = jwtTokenProvider.getExpirationDate(token).getTime();
        log.info("만료기한 : {}", tokenExpiration);
        tokenManagementService.addBlacklistToken(token, tokenExpiration, response);
    }

    public void deleteUser(Long userId) {
        // 사용자를 삭제하기 전에 Recipe의 userId를 null로 설정
        recipeService.setRecipesUserIdToNull(userId);
        // 사용자 삭제
        userRepository.deleteById(userId);
    }


    public UserInfoDto getUserInfoByEmail(String userEmail) {
        if (userEmail == null) {
            throw new IllegalArgumentException("계정 정보가 존재하지 않습니다.");
        }

        // DB에서 사용자 조회
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // UserInfoDto 반환
        return UserInfoDto.of(user);
    }

    public UserInfoDto updateUserInfo(String userEmail, UserUpdateDto updateDto) {
        if (userEmail == null) {
            throw new IllegalArgumentException("계정 정보가 존재하지 않습니다.");
        }

        // DB에서 사용자 조회
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        user.setUserNickname(updateDto.getUserNickname() != null ? updateDto.getUserNickname() : user.getUserNickname());
        if (updateDto.getUserPassword() != null && !passwordEncoder.matches(updateDto.getUserPassword(), user.getUserPassword())) {
            String password = passwordEncoder.encode(updateDto.getUserPassword());
            user.setUserPassword(password);
        }
        user.setUserAddress(updateDto.getUserAddress() != null ? updateDto.getUserAddress() : user.getUserAddress());
        user.setUserProfile(updateDto.getUserProfile() != null ? updateDto.getUserProfile() : user.getUserProfile());

        User updatedUser = userRepository.save(user);

        return UserInfoDto.of(user);
    }

    public OtherUserDto getOtherUserInfo(Long userId) {
        // DB에서 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("존재하지 않는 회원입니다."));

        return OtherUserDto.of(user);
    }

    public void deleteUserByUserEmail(UserLoginDto loginDto) {
        // DB 에서 사용자 조회
        User user = userRepository.findByUserEmail(loginDto.getUserEmail())
                .orElseThrow(() -> new UserNotFoundException("존재하지 않는 회원입니다."));

        if (loginDto.getUserPassword() == null || !passwordEncoder.matches(loginDto.getUserPassword(), user.getUserPassword())) {
            throw new PasswordMismatchException("비밀번호가 잘못 입력되었습니다.");
        }

        log.info("비밀번호 일치");
        // 사용자를 삭제하기 전에 Recipe의 userId를 null로 설정
        recipeService.setRecipesUserIdToNull(user.getUserId());

        log.info("레시피 유저 아이디 null 설정완료");
        // 사용자 삭제
        userRepository.delete(user);
    }
}
