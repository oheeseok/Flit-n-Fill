import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2"; // SweetAlert2 사용
import "../styles/main/MyPage.css";
import ProfileImageUploader from "../components/main/ProfileUploader"; // ProfileUploader 컴포넌트 사용
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { area } from "../data/area";

const MyPage: React.FC = () => {
  // 상태 관리
  const {
    user,
    fetchUserData,
    updateUserInfoWithFile,
    deleteUserAccount,
    setUser,
  } = useUser();
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fevel, setFevel] = useState(0);
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태 추가
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 파일 상태 추가

  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedSubArea, setSelectedSubArea] = useState<string>("");
  const [selectWidth, setSelectWidth] = useState<number>(400); // 초기값 설정

  const [passwordError, setPasswordError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [formValid, setFormValid] = useState(false);

  const areaSelectRef = useRef<HTMLSelectElement>(null);

  const navigate = useNavigate(); // useNavigate 훅을 사용

  // 선택된 지역에 따라 하위 지역 목록을 가져옴
  const subAreas =
    area.find((area) => area.name === selectedArea)?.subArea || [];

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

    console.log(
      "passwordcheck:",
      validatePassword(password) || password === ""
    );
    console.log(
      "passwordconfirmcheck:",
      validateConfirmPassword(password, confirmPassword) ||
        (password === null && confirmPassword === null)
    );
    console.log(
      "phonecheck:",
      validatePhone(phone) || phone === user?.userPhone
    );

    // 폼이 모두 유효한지 체크
    setFormValid(
      (validatePassword(password) || password === "") &&
        (validateConfirmPassword(password, confirmPassword) ||
          (password === "" && confirmPassword === "")) &&
        (validatePhone(phone) || phone === user?.userPhone) &&
        selectedSubArea !== "시, 군, 구" // 시, 군, 구 선택 여부 추가
    );
    console.log("formvaild:", formValid);
  }, [password, confirmPassword, phone, selectedSubArea]);

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

  // 컴포넌트가 마운트될 때 사용자 데이터 초기화
  useEffect(() => {
    const initializeUserData = async () => {
      if (!user) {
        await fetchUserData(); // DB에서 사용자 데이터 가져오기
      }
    };

    initializeUserData();
  }, [user, fetchUserData]);

  useEffect(() => {
    if (user) {
      setEmail(user.userEmail);
      setNickname(user.userNickname || "");
      setPhone(user.userPhone || "");
      setFevel(user.userKindness);

      // user.userAddress가 유효한 경우에만 split 호출
      if (user.userAddress) {
        const addressParts = user.userAddress.split(" ");
        setSelectedArea(addressParts[0] || "지역");
        setSelectedSubArea(addressParts[1] || "시, 군, 구");
      } else {
        // user.userAddress가 없을 경우 기본값 설정
        setSelectedArea("지역");
        setSelectedSubArea("시, 군, 구");
      }

      setProfileImage(user.userProfile || null);
    }
  }, [user]);

  // 이벤트 핸들러
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${selectedArea} ${selectedSubArea}`;
    const userUpdateDto = {
      userNickname: nickname,
      userPhone: phone,
      userAddress: fullAddress,
      userPassword: password, // password가 비어있지 않을 때만 추가
      userProfile: profileImage || "",
    };

    if (!formValid) {
      Swal.fire({
        title: "회원정보 변경 실패",
        text: "입력하신 정보가 올바르지 않습니다.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      const updatedUser = await updateUserInfoWithFile(
        userUpdateDto,
        selectedFile
      );

      Swal.fire({
        icon: "success",
        title: "프로필 업데이트 완료",
        text: "프로필 정보가 성공적으로 업데이트되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        setUser(updatedUser);
        localStorage.setItem("userProfile", updatedUser.userProfile);
        navigate("/mypage");
        window.location.reload();
      });
      // setProfileImage(updatedUser.userProfile); // 상태 갱신
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "프로필 업데이트 실패",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
        confirmButtonText: "확인",
      });
    }
  };

  const handleImageChange = (imageBase64: string) => {
    setProfileImage(imageBase64);
    const base64ToFile = (base64: string, filename: string) => {
      const arr = base64.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    };
    const file = base64ToFile(imageBase64, "uploaded-profile-image.jpg");
    setSelectedFile(file);
  };

  // 계정 삭제 함수
  const handleDeleteID = () => {
    // SweetAlert2로 비밀번호 입력 받기
    Swal.fire({
      title: "비밀번호를 입력해주세요",
      input: "password",
      inputLabel: "Your password",
      inputPlaceholder: "Enter your password",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      inputValidator: (value) => {
        if (!value) {
          return "비밀번호를 입력해 주세요.";
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // 비밀번호 확인 후 계정 삭제
        deleteUserAccount(result.value); // 비밀번호를 전달
        navigate("/"); // 비로그인 상태로 메인 페이지로 리디렉션
      }
    });
  };

  return (
    <div className="mypage-container">
      <div className="mypage-left">
        <img src="/assets/mypage-left.png" alt="Illustration" />
      </div>
      <div className="mypage-right">
        <h2>회원 정보 수정</h2>
        <div className="mypage-profile-picture">
          <ProfileImageUploader
            onChangeImage={handleImageChange}
            uploadedImage={profileImage}
          />
        </div>
        <div className="mypage-level">
          <div className="mypage-level-header">
            <div className="mypage-level-header">
              <h3>My f-evel</h3>
              <div className="mypage-fevel-container">
                <progress
                  className="mypage-fevel"
                  value={fevel}
                  max="7"
                ></progress>
                <div className="mypage-level-steps">
                  {[...Array(8)].map((_, index) => (
                    <span
                      key={index}
                      className={`mypage-level-step ${
                        index === fevel ? "active" : ""
                      }
                         ${fevel === 0 ? "zero-step" : ""}`}
                    >
                      {index}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <form className="mypage-form" onSubmit={handleEditProfile}>
          <div className="mypage-form-group">
            <label htmlFor="email">email</label>
            <input id="email" type="text" value={email} disabled />
          </div>
          <div className="mypage-form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Edit your nickname"
            />
          </div>
          <div className="mypage-form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Edit your phone number"
            />
          </div>
          {phoneError && (
            <div className="mypage-error-message">{phoneError}</div>
          )}
          <div className="mypage-form-group">
            <label htmlFor="address">Address</label>
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
          </div>
          <div className="mypage-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="변경하실 비밀번호를 입력해주세요."
            />
            {passwordError && (
              <div className="mypage-error-message">{passwordError}</div>
            )}
          </div>
          {/* Confirm Password 입력 */}
          <div className="mypage-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && (
              <div className="mypage-error-message">{confirmPasswordError}</div>
            )}
          </div>

          <div className="mypage-delete-id">
            <button
              type="button"
              className="mypage-delete-btn"
              onClick={handleDeleteID}
            >
              회원 탈퇴
            </button>
          </div>
          <div className="mypage-submit">
            <button type="submit" className="mypage-edit-btn">
              회원 정보 수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;
