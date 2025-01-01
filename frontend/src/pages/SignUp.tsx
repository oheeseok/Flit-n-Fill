import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        {
          userName: name,
          userEmail: email,
          userPassword: password,
          userNickname: nickname, // Nickname 포함
          userPhone: phone, // Phone 포함
          userAddress: address, // Address 포함
        }
      );
      console.log("회원가입 성공:", response.data); // response 사용
      // 성공 시 처리
      Swal.fire({
        title: "회원가입 성공",
        text: "환영합니다! 회원가입이 완료되었습니다.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      }).then(() => {
        // 성공 후 다른 페이지로 리디렉션 (예: 로그인 페이지)
        window.location.href = "/signin";
      });
    } catch (error: any) {
      // 에러 처리
      if (error.response) {
        Swal.fire({
          title: "회원가입 실패",
          text: error.response.data,
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          title: "회원가입 실패",
          text: "회원가입 요청 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "확인",
        });
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
          <div className="signup-text-name">Name</div>
          <input
            type="text"
            className="signup-text-name-input"
            placeholder="Enter your name"
            value={name}
            onChange={handleChangeName}
          />

          {/* Email 입력 */}
          <div className="signup-text-email">Email address</div>
          <input
            type="text"
            className="signup-text-email-input"
            placeholder="Enter your email"
            value={email}
            onChange={handleChangeEmail}
          />

          {/* Password 입력 */}
          <div className="signup-text-password">Password</div>
          <input
            type="password"
            className="signup-text-password-input"
            placeholder="Enter your password"
            value={password}
            onChange={handleChangePassword}
          />

          {/* Nickname 입력 */}
          <div className="signup-text-nickname">Nickname</div>
          <input
            type="text"
            className="signup-text-nickname-input"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={handleChangeNickname}
          />

          {/* Phone 입력 */}
          <div className="signup-text-phone">Phone</div>
          <input
            type="text"
            className="signup-text-phone-input"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handleChangePhone}
          />

          {/* Address 입력 */}
          <div className="signup-text-address">Address</div>
          <input
            type="text"
            className="signup-text-address-input"
            placeholder="Enter your address"
            value={address}
            onChange={handleChangeAddress}
          />

          {/* Sign Up 버튼 */}
          <div className="signup-button-container">
            <button className="signup-button-login" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
          <div className="signup-button-or">or</div>

          <div className="signup-button-container2">
            {/* 구글 로그인 버튼 */}
            <button
              className="signup-button-google"
              onClick={() =>
                (window.location.href =
                  "http://localhost:8080/oauth2/authorization/google")
              }
            >
              구글로그인
            </button>

            {/* 카카오 로그인 버튼 */}
            <button
              className="signup-button-kakao"
              onClick={() =>
                (window.location.href =
                  "http://localhost:8080/oauth2/authorization/kakao")
              }
            >
              카카오로그인
            </button>
          </div>
          {/* 이미 계정이 있는 경우 로그인 링크 */}
          <div>
            Have an account? <a href="/signin">Sign In</a>
          </div>
        </div>

        <div className="signup-image"></div>
      </div>
    </>
  );
};

export default SignUp;