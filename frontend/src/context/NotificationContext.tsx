import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  NotificationViewDto,
  NotificationContextType,
} from "../interfaces/NotificationInterfaces";
const apiUrl = import.meta.env.VITE_API_URL;

// Context 기본 값
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  setNotifications: () => {},
  getNotificationList: async () => {},
  markAllAsRead: async () => {},
  markAsRead: async () => {},
  deleteOneNotification: async () => {},
  deleteAllNotifications: async () => {}
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
      const response = await axios.get(`${apiUrl}/api/notifications`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });
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
        `${apiUrl}/api/notifications/read`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to markAllAsRead");
      }
      // 전체 읽음 처리 후 알림 목록을 갱신
      await getNotificationList(); // 전체 읽음 후 알림 목록을 다시 조회하여 갱신
    } catch (error) {
      console.error("Error markAllAsRead:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/notifications/${notificationId}/read`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to markAsRead");
      }
      // 전체 읽음 처리 후 알림 목록을 갱신
      await getNotificationList(); // 전체 읽음 후 알림 목록을 다시 조회하여 갱신
    } catch (error) {
      console.error("Error markAsRead:", error);
    }
  };

  const deleteOneNotification = async (notificationId: number) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/notifications/${notificationId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      if (response.status !== 204) {
        throw new Error("Failed to deleteOneNotification");
      }
      await getNotificationList(); // 알림 목록을 다시 조회하여 갱신
    } catch (error) {
      console.error("Error deleteOneNotification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/notifications`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      if (response.status !== 204) {
        throw new Error("Failed to deleteAllNotifications");
      }
      await getNotificationList(); // 알림 목록을 다시 조회하여 갱신
    } catch (error) {
      console.error("Error deleteAllNotifications:", error);
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
        deleteOneNotification,
        markAsRead,
        deleteAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook 생성
export const useNotification = () => useContext(NotificationContext);
