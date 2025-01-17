import React, { useState, ChangeEvent, useEffect, KeyboardEvent, useRef } from "react";
import axios from "axios";
import "../styles/common/SignIn.css";
import { useSSEContext } from "../context/SSEContext";
import Swal from "sweetalert2";
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

  // Ref 생성
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
          localStorage.setItem("fevel", response.data.userKindness.toString());
          localStorage.setItem("userNickname", response.data.userNickname);

          Swal.fire({
            icon: "success",
            title: "로그인 완료",
            text: "소셜 로그인 성공",
          });

          // 이후 대시보드로 리디렉션
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error);

            Swal.fire({
              icon: "error",
              title: "로그인 실패",
              text: "소셜 로그인 실패",
            });
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
      localStorage.setItem("fevel", response.data.userKindness.toString());
      localStorage.setItem("userNickname", response.data.userNickname);

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

      const currentUserEmail = localStorage.getItem("userEmail");
      console.log("Current User Email:", currentUserEmail);
      if (currentUserEmail) {
        console.log("Calling startSSE");
        startSSE(`${apiUrl}/api/subscribe/${currentUserEmail}`);
      }

      await Swal.fire({
        icon: "success",
        title: "로그인 완료",
        text: "로그인 성공",
      }).then(() => {
          // 로그인 후 대시보드로 리디렉션
          window.location.href = "/"; // 홈 페이지로 리디렉션
    });
    } catch (error: any) {
      // 에러 처리
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: error.response.data,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "로그인 요청 중 오류가 발생했습니다.",
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

  // Enter 키 핸들러
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (nextRef && nextRef.current) {
        nextRef.current.focus(); // 다음 입력 필드로 포커스 이동
      } else {
        handleLogin(); // 포커스가 없으면 로그인 처리
      }
    }
  };

  return (
    <>
      <div className="signinbody">
        <div className="signin-container">
          <div className="signin-title">로그인</div>
          {/* <div className="signin-title-2">
            Enter your credentials to access your account
          </div> */}

          <div className="signin-text">이메일</div>
          <input
            type="text"
            className="signin-input"
            placeholder="이메일 주소를 입력해주세요."
            value={email}
            onChange={handleChangeEmail}
            onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
          />

          <div className="signin-text">비밀번호</div>
          <input
            type="password"
            className="signin-input"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={handleChangePassword}
            ref={passwordInputRef} // Ref 연결
            onKeyDown={(e) => handleKeyDown(e)} // Enter 시 로그인 처리
          />

          <button className="signin-button-login" onClick={handleLogin}>
            로그인
          </button>

          <div className="signup-button-or">or</div>
          <div className="signin-button-container2">
            <button
              className="signin-button-google"
              onClick={() =>
                (window.location.href = `${apiUrl}/oauth2/authorization/google`)
              }
            >
              <img src="src/assets/google_login.png" alt="Google 로그인" />
            </button>

            <button
              className="signin-button-kakao"
              onClick={() =>
                (window.location.href = `${apiUrl}/oauth2/authorization/kakao`)
              }
            >
              <img src="src/assets/kakao_login.png" alt="Kakao 로그인" />
            </button>
          </div>

          <div>
            계정이 없다면? <a href="/signUp">회원가입</a>
          </div>
        </div>

        <div className="signin-image"></div>
      </div>
    </>
  );
};

export default SignIn;
