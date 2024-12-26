import React, { useState } from "react";
import axios from "axios";
import "../styles/common/SignUp.css";

const SignUp = () => {
  // 상태 관리
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>(""); // 추가된 상태: Nickname
  const [phone, setPhone] = useState<string>(""); // 추가된 상태: Phone
  const [address, setAddress] = useState<string>(""); // 추가된 상태: Address

  // Sign Up 요청 처리 함수
  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/user/register", {
        userName: name,
        userEmail: email,
        userPassword: password,
        userNickname: nickname, // Nickname 포함
        userPhone: phone, // Phone 포함
        userAddress: address, // Address 포함
      });

      // 성공 시 처리
      alert(response.data); // 서버에서 받은 성공 메시지

      // 성공 후 다른 페이지로 리디렉션 (예: 로그인 페이지)
      window.location.href = "/signin";

    } catch (error: any) {
      // 에러 처리
      if (error.response) {
        alert(error.response.data); // 서버에서 받은 에러 메시지
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  // Name 입력 값 변경 처리
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Email 입력 값 변경 처리
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Password 입력 값 변경 처리
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

    // Nickname 입력 값 변경 처리
  const handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // Phone 입력 값 변경 처리
  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  // Address 입력 값 변경 처리
  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <>
      <div className="signupbody">
        <div className="signup-container">
          <div className="signup-title">Get Started Now</div>

          {/* Name 입력 */}
          <div className="signup-text">Name</div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleChangeName}
          />

          {/* Email 입력 */}
          <div className="signup-text">Email address</div>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={handleChangeEmail}
          />

          {/* Password 입력 */}
          <div className="signup-text">Password</div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleChangePassword}
          />

          {/* Nickname 입력 */}
          <div className="signup-text">Nickname</div>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={handleChangeNickname}
          />

          {/* Phone 입력 */}
          <div className="signup-text">Phone</div>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handleChangePhone}
          />

          {/* Address 입력 */}
          <div className="signup-text">Address</div>
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={handleChangeAddress}
          />

          {/* Sign Up 버튼 */}
          <button onClick={handleSignUp}>Sign Up</button>

          <div>---------or---------</div>

          {/* 구글 로그인 버튼 */}
          <button onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
            구글로그인
          </button>

          {/* 카카오 로그인 버튼 */}
          <button onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/kakao"}>
            카카오로그인
          </button>

          {/* 이미 계정이 있는 경우 로그인 링크 */}
          <div>Have an account? <a href="/signin">Sign In</a></div>
        </div>

        <div className="signup-image"></div>
      </div>
    </>
  );
};

export default SignUp;
