import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios"; // DB와 통신할 때 사용할 라이브러리

// 사용자 타입 정의
interface User {
  userName: string;
  userEmail: string;
  userNickname: string;
  userPassword: string; // 요거슨 보안관리 주의
  userPhone: string;
  userAddress: string;
  userProfile: string | null;
}

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  fetchUserData: () => Promise<void>;
  updateUserInfo: (updatedUser: Partial<User>) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  // DB에서 사용자 데이터 가져오기
  const fetchUserData = async () => {
    if (!accessToken) {
      console.warn("No access token available.");
      return;
    }

    try {
      const response = await axios.get<User>(
        "http://localhost:8080/api/user/info",
        {
          // headers: { Authorization: `Bearer ${accessToken}` }, // Authorization 헤더 추가
          withCredentials: true,
        }
      );

      setUser(response.data); // 사용자 데이터 설정
      console.log("User data loaded:", response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null); // 실패 시 초기화
    }
  };

  // 사용자 정보 업데이트 함수
  const updateUserInfo = async (updatedUser: Partial<User>) => {
    if (!accessToken) {
      console.warn("No access token available.");
      return;
    }

    try {
      console.log("Updating user info:", updatedUser); // 전송 데이터 로그
      const response = await axios.put(
        "http://localhost:8080/api/user/info",
        updatedUser,
        {
          // headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser!,
          ...updatedUser,
        }));
        // const fetchUserData = async () => {
        //   if (!accessToken) {
        //     console.warn("No access token available.");
        //     return;
        //   }

        //   try {
        //     console.log("Sending request with token:", accessToken); // 디버깅용 로그

        //     const response = await axios.get<any>(
        //       "http://localhost:8080/api/user/info",
        //       {
        //         withCredentials: true,
        //       }
        //     );

        // if (
        //   typeof response.data === "string" &&
        //   response.data.includes("<html>")
        // ) {
        //   console.error("Unexpected HTML response. Authentication failed.");
        //   logout();
        //   return;
        // }
        // setUser((prevUser) => ({
        //   ...prevUser!,
        //   ...updatedUser, // 업데이트된 정보 반영
        // }));

        // setUser(response.data); // 사용자 데이터 설정
        console.log("User data updated:", response.data);
      } else {
        console.warn("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken,
        fetchUserData,
        updateUserInfo,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
