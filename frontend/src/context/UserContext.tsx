import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios"; // DB와 통신할 때 사용할 라이브러리

import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_API_URL;

// 사용자 타입 정의
interface User {
  userId: number;
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
      userProfile: string;
    },
    userProfileFile: File | null
  ) => Promise<User>; // 반환 타입을 `Promise<User>`로 수정
  deleteUserAccount: (password: string) => Promise<void>; // 여기서 함수 추가
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
      const response = await axios.get<User>(`${apiUrl}/api/user/info`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });

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
      const response = await axios.put(`${apiUrl}/api/user/info`, updatedUser, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });

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
      userProfile: string;
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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
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

  const deleteUserAccount = async (password: string): Promise<void> => {
    if (!accessToken) {
      console.warn("No access token available.");
      return;
    }

    try {
      const userLoginDto = {
        userEmail: localStorage.getItem("userEmail"),
        userPassword: password, // 비밀번호 추가
      };

      const response = await axios.delete("/api/user/info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        data: userLoginDto, // @RequestBody로 비밀번호 포함
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");

        // 삭제 성공 후 알림
        Swal.fire({
          icon: "success",
          title: "회원 탈퇴 성공",
          text: "계정이 성공적으로 삭제되었습니다.",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      console.error("Failed to delete user account:", error);

      // 에러 처리
      Swal.fire({
        icon: "error",
        title: "회원 탈퇴 실패",
        text: "회원 탈퇴 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };
  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
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
        deleteUserAccount,
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
