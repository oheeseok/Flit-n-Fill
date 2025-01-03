import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "../styles/common/SignIn.css";
import { useSSEContext } from "../context/SSEContext";
const apiUrl = import.meta.env.VITE_API_URL;

interface UserLoginResponse {
  accessToken: string;
  userEmail: string;
  userProfile: string;
}

const SignIn: React.FC = () => {
  const { startSSE } = useSSEContext();
  // 상태 관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      // API 요청을 보냄 (localhost:8080)
      const response = await axios.post<UserLoginResponse>(
        `${apiUrl}/api/user/login`,
        {
          userEmail: email,
          userPassword: password,
        },
        {
          withCredentials: true, // CORS 에러를 해결하기 위해 credentials: 'include'로 설정
        }
      );

      // 로그인 성공 시 받은 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userEmail", response.data.userEmail);
      localStorage.setItem("userProfile", response.data.userProfile);

      console.log(response);
      alert("로그인 성공"); // 로그인 성공 메시지

      const currentUserEmail = localStorage.getItem("userEmail");
      console.log("Current User Email:", currentUserEmail);
      if (currentUserEmail) {
        console.log("Calling startSSE");
        startSSE(`${apiUrl}/api/subscribe/${currentUserEmail}`);
      }

      // 로그인 후 대시보드로 리디렉션
      window.location.href = "/"; // 홈 페이지로 리디렉션
    } catch (error: any) {
      // 에러 처리
      if (error.response) {
        alert(error.response.data); // 서버에서 받은 에러 메시지
      } else {
        alert("로그인 요청 중 오류가 발생했습니다.");
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

  return (
    <>
      <div className="signinbody">
        <div className="signin-container">
          <div className="signin-title">Welcome back!</div>
          <div className="signin-title-2">
            Enter your credentials to access your account
          </div>

          <div className="signin-text">Email address</div>
          <input
            type="text"
            className="signin-input"
            placeholder="Enter your email"
            value={email}
            onChange={handleChangeEmail}
          />

          <div className="signin-text">Password</div>
          <input
            type="password"
            className="signin-input"
            placeholder="Enter your password"
            value={password}
            onChange={handleChangePassword}
          />

          <label>
            <input type="checkbox" />
            Remember your id
          </label>

          <button onClick={handleLogin}>Log In</button>

          <div>---------or---------</div>
          <button
            onClick={() =>
              (window.location.href =
                `${apiUrl}/oauth2/authorization/google`)
            }
          >
            구글 로그인
          </button>
          <button
            onClick={() =>
              (window.location.href =
                `${apiUrl}/oauth2/authorization/kakao`)
            }
          >
            카카오 로그인
          </button>

          <div>
            Don't have an account? <a href="/signUp">Sign Up</a>
          </div>
        </div>

        <div className="signin-image"></div>
      </div>
    </>
  );
};

export default SignIn;
