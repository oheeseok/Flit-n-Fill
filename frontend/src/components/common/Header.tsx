import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Icon from "../../assets/icon.png";
import "../../styles/common/Header.css";
import NotificationPopup from "../../pages/NotificationPopup";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userProfile = localStorage.getItem("userProfile");

    if (token) {
      setIsLoggedIn(true);
    }

    // userProfile이 null이면 기본 아이콘, 아니면 userProfile에 저장된 이미지 불러오기
    if (userProfile !== "undefined" && userProfile !== null) {
      setProfileImage(userProfile);
    } else {
      setProfileImage("/assets/user-icon.png"); // 기본 아이콘
    }
  }, []);
  const toggleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃",
      text: "정말 로그아웃 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        Swal.fire("로그아웃 완료", "로그아웃 되었습니다.", "success");
        navigate("/");
      }
    });
  };

  const handleMenuClick = () => {
    toggleUserMenu();
  }

  return (
    <div className="header">
      <Link to="/" className="logo">
        <img src={Icon} alt="Flit-n-Fill" />
      </Link>

      <ul className="headermenu">
        <Link to="/fridge">fridge</Link>
        <Link to="/recipe">recipe</Link>
        <Link to="/community">community</Link>
        <Link to="/cart">cart</Link>

        {/* 로그인 상태에 따라 메뉴 다르게 표시 */}
        {isLoggedIn ? (
          <>
            <a
              href="#"
              className="header-notification"
              onClick={toggleNotification}
            >
              <img src="/assets/notification-icon.png" alt="notification" />
            </a>
            {/* 알림 팝업 */}
            {showNotification && <NotificationPopup />}

            {/* 알림창 */}
            {showNotification && (
              <div className="header-notification-popup">
                <p>New notification!</p>
                <p>No new messages</p>
              </div>
            )}

            {/* 사용자 메뉴 버튼 */}
            <a href="#" className="header-user" onClick={toggleUserMenu}>
              <img src={profileImage || "/assets/user-icon.png"} alt="user" />
            </a>
            {/* 사용자 메뉴창 */}
            {showUserMenu && (
              <div className="header-user-menu">
                <ul>
                  <li>
                    <Link to="/mypage" onClick={handleMenuClick}>회원 정보 수정</Link>
                  </li>
                  <li>
                    <Link to="#" onClick={handleMenuClick}>내 게시글 보기</Link>
                  </li>
                  <li>
                    <Link to="#" onClick={handleMenuClick}>내 거래글 보기</Link>
                  </li>
                  <li>
                    <Link to="#" onClick={handleMenuClick}>내 레시피 보기</Link>
                  </li>
                  <li>
                    <a href="#" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/signin">sign in</Link>
            <Link to="/signup">sign up</Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;