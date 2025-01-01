import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2"; // SweetAlert2 사용
import "../styles/main/MyPage.css";
import ProfileImageUploader from "../components/main/ProfileUploader"; // ProfileUploader 컴포넌트 사용

const MyPage: React.FC = () => {
  // 상태 관리
  const { user, fetchUserData, updateUserInfo } = useUser();
  const [nickname, setNickname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 기본 프로필 이미지 URL
  const DEFAULT_PROFILE_IMAGE =
    "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png";

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
      console.log("User data loaded:", user);
      setNickname(user.userNickname || "");
      setPhone(user.userPhone || "");
      setAddress(user.userAddress || "");
      setProfileImage(user.userProfile || DEFAULT_PROFILE_IMAGE);
    }
  }, [user]);

  // 이벤트 핸들러
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserInfo({
        userNickname: nickname,
        userPhone: phone,
        userAddress: address,
        userProfile: profileImage,
        userPassword: password,
      });
      Swal.fire({
        icon: "success",
        title: "프로필 업데이트 완료",
        text: "프로필 정보가 성공적으로 업데이트되었습니다.",
        confirmButtonText: "확인",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "프로필 업데이트 실패",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
        confirmButtonText: "확인",
      });
      console.error("Failed to update profile:", error);
    }
  };

  const handleDeleteID = () => {
    // SweetAlert2로 삭제 확인 창
    Swal.fire({
      title: "정말 계정을 삭제하시겠습니까?",
      text: "계정을 삭제하면 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // SweetAlert2로 성공 메시지 표시
        Swal.fire({
          icon: "success",
          title: "계정 삭제 완료",
          text: "계정이 성공적으로 삭제되었습니다.",
          confirmButtonText: "확인",
        }).then(() => {
          console.log("ID Deleted");
        });
      }
    });
  };

  return (
    <div className="mypage-container">
      {/* 왼쪽: 이미지 */}
      <div className="mypage-left">
        <img src="/assets/mypage-left.png" alt="Illustration" />
      </div>

      {/* 오른쪽: 프로필 수정 */}
      <div className="mypage-right">
        <h2>Edit profile</h2>
        <div className="mypage-profile-picture">
          {/* ProfileImageUploader 컴포넌트 사용 */}
          <ProfileImageUploader
            onChangeImage={(image) => setProfileImage(image)}
            uploadedImage={profileImage || DEFAULT_PROFILE_IMAGE}
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
