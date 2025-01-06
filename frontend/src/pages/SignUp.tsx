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
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 추가된 상태: confirmPassword
  const [nickname, setNickname] = useState<string>(""); // 추가된 상태: Nickname
  const [phone, setPhone] = useState<string>(""); // 추가된 상태: Phone

  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedSubArea, setSelectedSubArea] = useState<string>("");
  const [selectWidth, setSelectWidth] = useState<number>(200); // 초기값 설정

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [formValid, setFormValid] = useState<boolean>(false);

  const areaSelectRef = useRef<HTMLSelectElement>(null);

  // 선택된 지역에 따라 하위 지역 목록을 가져옴
  const subAreas =
    area.find((area) => area.name === selectedArea)?.subArea || [];

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const minLength = 8; // 비밀번호 최소 길이
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return password.length >= minLength && regex.test(password);
  };

  // 비밀번호 확인 검사
  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };

  // 전화번호 유효성 검사
  const validatePhone = (phone: string) => {
    const regex = /^\d{3}-\d{4}-\d{4}$/;
    return regex.test(phone);
  };

  // 실시간 유효성 검사
  useEffect(() => {
    setEmailError(
      email === ""
        ? ""
        : validateEmail(email)
        ? ""
        : "이메일 형식이 올바르지 않습니다."
    );
    setPasswordError(
      password === ""
        ? ""
        : validatePassword(password)
        ? ""
        : "비밀번호는 최소 8자 이상, 영문과 숫자를 포함해야 합니다."
    );
    setConfirmPasswordError(
      confirmPassword === ""
        ? ""
        : validateConfirmPassword(password, confirmPassword)
        ? ""
        : "비밀번호가 일치하지 않습니다."
    );
    setPhoneError(
      phone === ""
        ? ""
        : validatePhone(phone)
        ? ""
        : "전화번호는 000-0000-0000 형식으로 입력해주세요."
    );

    // 폼이 모두 유효한지 체크
    setFormValid(
      validateEmail(email) &&
        validatePassword(password) &&
        validateConfirmPassword(password, confirmPassword) &&
        validatePhone(phone)
    );
  }, [email, password, confirmPassword, phone]);

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
    if (!formValid) {
      Swal.fire({
        title: "회원가입 실패",
        text: "입력하신 정보가 올바르지 않습니다.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "확인",
      });
      return;
    }

    // 입력 값이 빈칸일 경우 가입 불가
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !nickname ||
      !phone ||
      !selectedArea ||
      !selectedSubArea
    ) {
      Swal.fire({
        title: "회원가입 실패",
        text: "모든 필드에 값을 입력해주세요.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "확인",
      });
      return;
    }
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

  // Confirm Password 입력 값 변경 처리
  const handleChangeConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
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
          <div className="signup-title">회원 가입</div>

          {/* Name 입력 */}
          <div className="signup-text-name">이름</div>
          <input
            type="text"
            className="signup-text-input"
            placeholder="이름을 입력해주세요."
            value={name}
            onChange={handleChangeName}
          />

          {/* Email 입력 */}
          <div className="signup-text-email">이메일</div>
          <input
            type="text"
            className="signup-text-input"
            placeholder="사용하실 이메일 주소를 입력해주세요."
            value={email}
            onChange={handleChangeEmail}
          />
          {emailError && <div className="error-message">{emailError}</div>}

          {/* Password 입력 */}
          <div className="signup-text-password">비밀번호</div>
          <input
            type="password"
            className="signup-text-input"
            placeholder="사용하실 비밀번호를 입력해주세요."
            value={password}
            onChange={handleChangePassword}
          />
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}

          {/* Confirm Password 입력 */}
          <div className="signup-text-password">비밀번호 (확인)</div>
          <input
            type="password"
            className="signup-text-input"
            placeholder="비밀번호를 다시 입력해주세요."
            value={confirmPassword}
            onChange={handleChangeConfirmPassword}
          />
          {confirmPasswordError && (
            <div className="error-message">{confirmPasswordError}</div>
          )}

          {/* Nickname 입력 */}
          <div className="signup-text-nickname">닉네임</div>
          <input
            type="text"
            className="signup-text-input"
            placeholder="사용하실 닉네임을 입력해주세요."
            value={nickname}
            onChange={handleChangeNickname}
          />

          {/* Phone 입력 */}
          <div className="signup-text-phone">전화번호</div>
          <input
            type="text"
            className="signup-text-input"
            placeholder="휴대전화 번호를 입력해주세요."
            value={phone}
            onChange={handleChangePhone}
          />
          {phoneError && <div className="error-message">{phoneError}</div>}

          {/* Address 입력 */}
          <div className="signup-container-address">
            <div className="signup-text-address">주소</div>
            <div className="select-container">
              <select
                ref={areaSelectRef}
                value={selectedArea}
                onChange={handleAreaChange}
                style={{ width: `${selectWidth}px` }} // 고정된 너비 적용
              >
                <option className="select-container-address" value="">
                  지역
                </option>
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
          </div>
          {/* Sign Up 버튼 */}
          <div className="signup-button-container">
            <button className="signup-button-login" onClick={handleSignUp}>
              가입하기
            </button>
          </div>
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
          {/* 이미 계정이 있는 경우 로그인 링크 */}
          <div>
            계정이 이미 있다면? <a href="/signup">로그인</a>
          </div>
        </div>

        <div className="signup-image"></div>
      </div>
    </>
  );
};

export default SignUp;
