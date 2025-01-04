import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Icon from "../../assets/icon.png";
import "../../styles/common/Header.css";
import NotificationPopup from "../../pages/NotificationPopup";

import { useSSEContext } from "../../context/SSEContext";
const apiUrl = import.meta.env.VITE_API_URL;


const Header = () => {
  const { stopSSE } = useSSEContext();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          const userUrl = `${apiUrl}/api/subscribe/${userEmail}`;
          stopSSE(userUrl); // SSE 연결 종료
        }
        localStorage.clear();
        setIsLoggedIn(false);
        Swal.fire("로그아웃 완료", "로그아웃 되었습니다.", "success");
        navigate("/");
      }
    });
  };

  const handleMenuClick = () => {
    toggleUserMenu();
  };

  const menuRef = useRef<HTMLDivElement>(null); // 메뉴 참조
  const navigate = useNavigate();

  // 외부 클릭 감지 핸들러
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowUserMenu(false); // 메뉴 닫기
    }
  };

  // 이벤트 리스너 추가 및 제거
  useEffect(() => {
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

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

    if (localStorage.getItem("role") === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const toggleNotification = () => {
    setShowNotification((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

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
        {isLoggedIn && isAdmin && <Link to="/adminpage">adminpage</Link>}
        {/* adminpage로 이동하는 링크 추가 */}
        {/* 로그인 상태에 따라 메뉴 다르게 표시 */}
        {isLoggedIn ? (
          <>
            <a
              href="#"
              className="header-notification"
              onClick={toggleNotification}
            >
              <img src="/assets/notification-icon.png" alt="notification" />
            
            {/* 알림 팝업 */}
            {showNotification && (
              <NotificationPopup setShowNotification={setShowNotification} />
            )}
            </a>
            {/* 사용자 메뉴 버튼 */}
            <a href="#" className="header-user" onClick={toggleUserMenu}>
              <img src={profileImage || "/assets/user-icon.png"} alt="user" />
            
            {/* 사용자 메뉴창 */}
            {showUserMenu && (
              <div className="header-user-menu" ref={menuRef}>
                <ul>
                  <li>
                    <Link to="/mypage" onClick={() => {
                      handleMenuClick(); 
                      setShowUserMenu((prev) => !prev)
                      }}>
                      회원 정보 수정
                    </Link>
                  </li>
                  <li>
                    <Link to="/myposts" onClick={() => {
                      handleMenuClick(); 
                      setShowUserMenu((prev) => !prev)
                      }}>
                      내 게시글 목록
                    </Link>
                  </li>
                  <li>
                    <Link to="/chatroomlist" onClick={() => {
                      handleMenuClick(); 
                      setShowUserMenu((prev) => !prev)
                      }}>
                      내 거래방 목록
                    </Link>
                  </li>
                  <li>
                    <Link to="/myrecipes" onClick={() => {
                      handleMenuClick(); 
                      setShowUserMenu((prev) => !prev)
                      }}>
                      내 레시피 목록
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={handleLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
            </a>
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
