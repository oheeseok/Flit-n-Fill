import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Icon from "../../assets/icon.png";
import "../../styles/common/Header.css";
import NotificationPopup from "../../pages/NotificationPopup";

import { useSSEContext } from "../../context/SSEContext";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;


const Header = () => {
  const { stopSSE } = useSSEContext();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [userFevel, setUserFevel] = useState<string | null>(null);

  const handleLogout = async () => {  // handleLogout을 async 함수로 선언
    Swal.fire({
      title: "로그아웃",
      text: "정말 로그아웃 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
    }).then(async (result) => {  // then에서 비동기 함수 처리
      if (result.isConfirmed) {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          const userUrl = `${apiUrl}/api/subscribe/${userEmail}`;
          stopSSE(userUrl); // SSE 연결 종료
        }
        try {
          // 로그아웃 요청 보내기
          await axios.get(`${apiUrl}/api/user/logout`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              userEmail: localStorage.getItem("userEmail"),
            },
          });
  
          localStorage.clear();
          setIsLoggedIn(false);
  
          Swal.fire("로그아웃 완료", "로그아웃 되었습니다.", "success");
          navigate("/");
        } catch (error) {
          console.error("로그아웃 요청 실패:", error);
          Swal.fire("오류", "로그아웃 요청에 실패했습니다.", "error");
        }
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
    const nickname = localStorage.getItem("userNickname");
    const fevel = localStorage.getItem("fevel");

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

    setUserNickname(nickname);
    setUserFevel(fevel);
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
                {/* 사용자 정보 표시 */}
                <div className="header-user-info">
                  <p className="user-nickname">{userNickname}</p>
                  <p className="user-fevel">{userFevel} f-evel </p>
                  </div> 
            
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
