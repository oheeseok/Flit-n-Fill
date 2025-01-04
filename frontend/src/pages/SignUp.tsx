import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/common/SignUp.css";
import { area } from "../data/area";
const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  // 상태 관리
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>(""); // 추가된 상태: Nickname
  const [phone, setPhone] = useState<string>(""); // 추가된 상태: Phone

  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedSubArea, setSelectedSubArea] = useState<string>("");
  const [selectWidth, setSelectWidth] = useState<number>(200); // 초기값 설정

  const areaSelectRef = useRef<HTMLSelectElement>(null);

  // 선택된 지역에 따라 하위 지역 목록을 가져옴
  const subAreas =
    area.find((area) => area.name === selectedArea)?.subArea || [];

  // 이벤트 핸들러
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setSelectedSubArea(""); // 새로운 지역 선택 시 하위 지역 초기화
  };

  const handleSubAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubArea(e.target.value);
  };

  useEffect(() => {
    if (areaSelectRef.current) {
      setSelectWidth(areaSelectRef.current.offsetWidth); // 첫 번째 select의 너비를 계산
    }
  }, [selectedArea]);

  // Sign Up 요청 처리 함수
  const handleSignUp = async () => {
    try {
      const fullAddress = `${selectedArea} ${selectedSubArea}`;
      const response = await axios.post(`${apiUrl}/api/user/register`, {
        userName: name,
        userEmail: email,
        userPassword: password,
        userNickname: nickname, // Nickname 포함
        userPhone: phone, // Phone 포함
        userAddress: fullAddress,
      });
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
          <div className="select-container">
            <select
              ref={areaSelectRef}
              value={selectedArea}
              onChange={handleAreaChange}
              style={{ width: `${selectWidth}px` }} // 고정된 너비 적용
            >
              <option value="">지역</option>
              {area.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>

            {selectedArea && (
              <select
                value={selectedSubArea}
                onChange={handleSubAreaChange}
                style={{ width: `${selectWidth}px` }}
              >
                <option value="">시, 군, 구</option>
                {subAreas.map((subArea) => (
                  <option key={subArea} value={subArea}>
                    {subArea}
                  </option>
                ))}
              </select>
            )}
          </div>
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
                (window.location.href = `${apiUrl}/oauth2/authorization/google`)
              }
            >
              구글로그인
            </button>

            {/* 카카오 로그인 버튼 */}
            <button
              className="signup-button-kakao"
              onClick={() =>
                (window.location.href = `${apiUrl}/oauth2/authorization/kakao`)
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
