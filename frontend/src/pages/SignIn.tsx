import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/common/SignIn.css"; // 스타일 파일 경로는 프로젝트에 맞게 설정하세요.

interface UserLoginResponse {
  accessToken: string;
}

const SignIn: React.FC = () => {
  // 상태 관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      // API 요청을 보냄 (localhost:8080)
      const response = await axios.post<UserLoginResponse>(
        "http://localhost:8080/api/user/login",
        {
          userEmail: email,
          userPassword: password,
        }
      );

      // 로그인 성공 시 받은 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.data.accessToken);

      Swal.fire({
        title: "로그인 성공",
        text: "환영합니다!",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      }).then(() => {
        // 로그인 후 대시보드로 리디렉션
        window.location.href = "/";
      });
    } catch (error: any) {
      // 에러 처리
      if (error.response) {
        Swal.fire({
          title: "로그인 실패",
          text: error.response.data,
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          title: "로그인 실패",
          text: "로그인 요청 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "확인",
        });
      }
    }
  };

  // 이메일 입력 값 변경 처리
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 값 변경 처리
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 소셜 로그인 처리 함수
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="signinbody">
      <div className="signin-container">
        <div className="signin-title">Welcome back!</div>
        <div className="signin-title-2">
          Enter your credentials to access your account
        </div>

        <div className="signin-text1">Email address</div>
        <input
          type="text"
          className="signin-input1"
          placeholder="Enter your email"
          value={email}
          onChange={handleChangeEmail}
        />

        <div className="signin-text2">Password</div>
        <input
          type="password"
          className="signin-input2"
          placeholder="Enter your password"
          value={password}
          onChange={handleChangePassword}
        />

        <label className="signin-checkbox">
          <input type="checkbox" />
          Remember your id
        </label>

        <div className="signin-button-container1">
          <button className="signin-button-login" onClick={handleLogin}>
            Log In
          </button>
        </div>
        <div className="signin-button-or">or</div>
        <div className="signin-button-container2">
          <button className="signin-button-google" onClick={handleGoogleLogin}>
            google
          </button>
          <button className="signin-button-kakao" onClick={handleKakaoLogin}>
            kakao
          </button>
        </div>
        <div>
          Don't have an account? <a href="/signUp">Sign Up</a>
        </div>
      </div>

      <div className="signin-image"></div>
    </div>
  );
};

export default SignIn;
