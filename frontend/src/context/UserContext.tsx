import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios"; // DB와 통신할 때 사용할 라이브러리

// 사용자 타입 정의
interface User {
  userName: string;
  userEmail: string;
  userNickname: string;
  userPhone: string;
  userAddress: string;
  userProfile: string;
  userKindness: number;
}

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  fetchUserData: () => Promise<void>;
  updateUserInfo: (updatedUser: Partial<User>) => Promise<void>;
  updateUserInfoWithFile: (
    userUpdateDto: {
      userNickname: string;
      userPassword: string;
      userPhone: string;
      userAddress: string;
    },
    userProfileFile: File | null
  ) => Promise<User>; // 반환 타입을 `Promise<User>`로 수정
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
      console.log("Updating user info:", updatedUser);
      const response = await axios.put(
        "http://localhost:8080/api/user/info",
        updatedUser,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("User info updated successfully:", response.data);
        setUser((prevUser) => ({
          ...prevUser!,
          ...updatedUser, // 업데이트된 정보 반영
        }));
      } else {
        console.warn("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      throw error;
    }
  };

  const updateUserInfoWithFile = async (
    userUpdateDto: {
      userNickname: string;
      userPassword: string;
      userPhone: string;
      userAddress: string;
    },
    userProfileFile: File | null
  ): Promise<User> => {
    const formData = new FormData();

    formData.append(
      "userUpdateDto",
      new Blob([JSON.stringify(userUpdateDto)], { type: "application/json" })
    );

    if (userProfileFile) {
      formData.append("userProfile", userProfileFile);
    }

    try {
      const response = await axios.put<User>(
        "http://localhost:8080/api/user/info",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      return response.data; // API에서 반환된 `User` 객체 반환
    } catch (error) {
      console.error("Failed to update user info with file:", error);
      throw error; // 에러 전달
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
        updateUserInfoWithFile, // `Promise<User>` 반환
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
