import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

interface PrivateRouteProps {
  allowedPages: string[]; // 허용된 페이지 목록
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedPages,
}) => {
  const [authState, setAuthState] = useState({
    authenticated: false,
    blacked: false,
    expirationDate: "",
    isLoading: true, // 로딩 상태 추가
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/check`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        });

        const { authenticated, blacked, expirationDate } = response.data;

        setAuthState({
          authenticated,
          blacked,
          expirationDate: blacked ? expirationDate : "",
          isLoading: false,
        });

        if (blacked && allowedPages.includes("community")) {
          await Swal.fire({
            icon: "warning",
            title: "접근 제한",
            html: `커뮤니티 기능 이용이 제한됩니다.<br>블랙리스트 만료기한: <strong>${expirationDate}</strong>`,
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        await Swal.fire({
          icon: "error",
          title: "인증 오류",
          text: "로그인이 필요한 페이지입니다.",
        });
        setAuthState({
          authenticated: false,
          blacked: false,
          expirationDate: "",
          isLoading: false,
        });
        navigate("/signin");
      }
    };

    fetchAuth();
  }, [apiUrl, allowedPages, navigate]);

  if (authState.isLoading) {
    return <div>Loading...</div>; // 로딩 중 표시
  }

  return <>{children}</>;
};

export default PrivateRoute;
