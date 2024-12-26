import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Icon from "../../assets/icon.png";
import "../../styles/common/Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignOut = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault(); // 기본 동작을 막음 (페이지 리로드 또는 이동을 방지)
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    alert("로그아웃 되셧습니다.");
    navigate("/home"); // 로그아웃 후 홈으로 리디렉션
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

        {/* 로그인 상태에 따라 메뉴 다르게 표시 */}
        {isLoggedIn ? (
          <li>
            <a href="#" className="signout-link" onClick={handleSignOut}>
              Sign Out
            </a>
          </li>
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
