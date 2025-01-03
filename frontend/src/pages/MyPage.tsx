import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2"; // SweetAlert2 사용
import "../styles/main/MyPage.css";
import ProfileImageUploader from "../components/main/ProfileUploader"; // ProfileUploader 컴포넌트 사용
import { useNavigate } from "react-router-dom"; // useNavigate 추가

const MyPage: React.FC = () => {
  // 상태 관리
  const { user, fetchUserData, updateUserInfoWithFile, deleteUserAccount } =
    useUser();
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState(""); // 비밀번호 상태 추가
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 파일 상태 추가
  const navigate = useNavigate(); // useNavigate 훅을 사용

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
      setNickname(user.userNickname || "");
      setPhone(user.userPhone || "");
      setAddress(user.userAddress || "");
      setProfileImage(user.userProfile || null);
    }
  }, [user]);

  // 이벤트 핸들러
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const userUpdateDto = {
      userNickname: nickname,
      userPassword: password,
      userPhone: phone,
      userAddress: address,
    };

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
      });
      setProfileImage(updatedUser.userProfile); // 상태 갱신
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
        <h2>Edit profile</h2>
        <div className="mypage-profile-picture">
          <ProfileImageUploader
            onChangeImage={handleImageChange}
            uploadedImage={profileImage}
          />
        </div>
        <form className="mypage-form" onSubmit={handleEditProfile}>
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
          <div className="mypage-form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Edit your address"
            />
          </div>
          <div className="mypage-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Edit your password"
            />
          </div>
          <div className="mypage-delete-id">
            <button
              type="button"
              className="mypage-delete-btn"
              onClick={handleDeleteID}
            >
              Delete ID
            </button>
          </div>
          <div className="mypage-submit">
            <button type="submit" className="mypage-edit-btn">
              Edit profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;
