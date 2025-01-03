import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

interface PrivateRouteProps {
  allowedPages: string[]; // 허용된 페이지 목록
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedPages }) => {
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

        console.log("response Data:", response.data);
        const { authenticated, blacked, expirationDate } = response.data;
        console.log("authenticated:", authenticated);
        console.log("blacked:", blacked);

        setAuthState({
          authenticated : response.data.authenticated,
          blacked : response.data.blacked,
          expirationDate: response.data.blacked ? response.data.expirationDate : "",
          isLoading: false,
        });

        console.log("authState:",authState);

        if (blacked && allowedPages.includes("community")) {
            Swal.fire({
              icon: "warning",
              title: "접근 제한",
              html: `커뮤니티 기능 이용이 제한됩니다.<br>블랙리스트 만료기한: <strong>${expirationDate}</strong>`,
            }).then(() => {
              navigate("/");
            });
          }
        } catch (error) {
          console.error("Auth check failed", error);
          Swal.fire({
            icon: "error",
            title: "로그인 오류",
            text: "로그인이 필요한 페이지입니다.",
          }).then(() => {
            setAuthState({
              authenticated: false,
              blacked: false,
              expirationDate: "",
              isLoading: false,
            });
            navigate("/signin"); // Swal 확인 후에만 리다이렉트
          });
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
