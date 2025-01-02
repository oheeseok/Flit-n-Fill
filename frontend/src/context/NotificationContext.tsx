import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import {
  NotificationViewDto,
  NotificationContextType,
} from "../interfaces/NotificationInterfaces";

// Context 기본 값
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  setNotifications: () => {},
  getNotificationList: async () => {},
});

// Provider 컴포넌트
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationViewDto[]>([]);

  const getNotificationList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/notifications",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch notification list");
      }
      const data: NotificationViewDto[] = response.data;
      setNotifications(data);
      //   console.log("data: ", data);
    } catch (error) {
      console.error("Error fetching notification rooms:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:8080/api/notifications/read",
        {
          withCredentials: true,
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to markAllAsRead");
      }
    } catch (error) {
      console.error("Error markAllAsRead:", error);
    }
  };

  // 컴포넌트가 마운트될 때 trade room 리스트를 가져옴
  useEffect(() => {
    getNotificationList();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        getNotificationList,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook 생성
export const useNotification = () => useContext(NotificationContext);
