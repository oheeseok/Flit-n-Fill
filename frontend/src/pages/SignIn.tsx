import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import "../styles/common/SignIn.css";
import { useSSEContext } from "../context/SSEContext";
const apiUrl = import.meta.env.VITE_API_URL;

interface UserLoginResponse {
  accessToken: string;
  userEmail: string;
  userProfile: string;
  blacked: boolean;
  blacklistExpiryDate: Date;
  role: string;
  userNickname: string;
  userKindness: number;
}

const SignIn: React.FC = () => {
  const { startSSE } = useSSEContext();
  // 상태 관리
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // URL에서 토큰을 가져오기 위한 상태
  const [tokenFromRedirect, setTokenFromRedirect] = useState<string | null>(
    null
  );

  // 리디렉션 URL에서 토큰을 가져오는 useEffect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("socialtoken");
    if (token) {
      setTokenFromRedirect(token); // 토큰 상태 업데이트
      console.log(tokenFromRedirect);
    }
  }, []);

  // social 로그인 처리 함수
  useEffect(() => {
    if (tokenFromRedirect) {
      // 토큰으로 로그인 처리 (백엔드에서 토큰을 받아서 검증)
      axios
        .post<UserLoginResponse>(
          `${apiUrl}/api/user/login/social`,
          tokenFromRedirect // 'socialToken'을 'data'로 전달
        )
        .then((response) => {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("userEmail", response.data.userEmail);
          localStorage.setItem("userProfile", response.data.userProfile);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("fevel", response.data.userKindness.toString())
          localStorage.setItem("userNickname", response.data.userNickname)

          alert("소셜 로그인 성공");
          // 이후 대시보드로 리디렉션
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error)
          alert("소셜 로그인 실패");
        });
    }
  }, [tokenFromRedirect]);

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
      console.log("response data:", response.data);

      // 로그인 성공 시 받은 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userEmail", response.data.userEmail);
      localStorage.setItem("userProfile", response.data.userProfile);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("fevel", response.data.userKindness.toString())
      localStorage.setItem("userNickname", response.data.userNickname)

      console.log("response data:", response.data);
      if (response.data.blacked) {
        const expiryDate = new Date(response.data.blacklistExpiryDate);
        const formattedDate = `${expiryDate.getFullYear()}년 ${
          expiryDate.getMonth() + 1
        }월 ${expiryDate.getDate()}일 ${expiryDate.getHours()}시 ${expiryDate.getMinutes()}분`;
        localStorage.setItem("isBlacked", "true");
        localStorage.setItem("balcklistExpiryDate", formattedDate);
      }
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
            placeholder="이메일 주소를 입력해주세요."
            value={email}
            onChange={handleChangeEmail}
          />

          <div className="signin-text">Password</div>
          <input
            type="password"
            className="signin-input"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={handleChangePassword}
          />

          <button className="signin-button-login" onClick={handleLogin}>
            Log In
          </button>

          <div className="signup-button-or">or</div>
          <div className="signin-button-container2">
            <button className="signin-button-google"
              onClick={() =>
                (window.location.href = `${apiUrl}/oauth2/authorization/google`)
              }
            >
              <img
                src="src/assets/google_login.png"
                alt="Google 로그인"
              />
            </button>

            <button className="signin-button-kakao"
              onClick={() =>
                (window.location.href = `${apiUrl}/oauth2/authorization/kakao`)
              }
            >
              <img
                src="src/assets/kakao_login.png"
                alt="Kakao 로그인"
              />
            </button>
          </div>

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
