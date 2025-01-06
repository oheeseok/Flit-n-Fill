import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBlacked, setIsBlacked] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/check`
            , {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userEmail": localStorage.getItem("userEmail")
                }
            }
          );
        setIsAuthenticated(response.data.isAuthenticated);
        setIsBlacked(response.data.isBlacked);
        setExpirationDate(response.data.expirationDate);
        
        console.log(response.data);

        // 블랙 유저 상태에 따라 리다이렉트 처리
        if (isBlacked) {
          await Swal.fire({
            icon: "error",
            title: "권한 오류",
            text: `일부 페이지에 접근할 수 없습니다. 블랙리스트 만료기한 : ${expirationDate}`,
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsBlacked(false);
        setExpirationDate("");
        setIsAuthenticated(false);
        navigate("/");
      }
    };

    fetchAuth();
  }, []);

  return { isAuthenticated, isBlacked };
};

export default useAuth;