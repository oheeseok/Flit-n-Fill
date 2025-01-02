import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/common/NotificationPopup.css";
import { useNotification } from "../context/NotificationContext";
import { NotificationViewDto } from "../interfaces/NotificationInterfaces";
import { fromEnumToDescription } from "../components/enum";

const NotificationPopup: React.FC = () => {
  const { notifications, getNotificationList, markAllAsRead } =
    useNotification();

  // 알림 목록 가져오기
  useEffect(() => {
    getNotificationList();
    console.log("Fetching notifications...", notifications);
  }, []);

  // 읽지 않은 알림 필터링
  const unreadNotifications = notifications.filter(
    (notification) => !notification.notificationIsRead
  );

  return (
    <div className="notification-popup">
      <div className="notification-header">
        <button onClick={() => markAllAsRead()}>전체 읽음</button>
      </div>
      {unreadNotifications.length > 0 ? (
        unreadNotifications.map((notification) => (
          <div key={notification.notificationId} className="notification-item">
            <p>[{fromEnumToDescription(notification.notificationType)}]</p>
            <p>{notification.notificationMessage}</p>
            {/* <span>{notification.timestamp}</span> */}
          </div>
        ))
      ) : (
        <p>새 알림이 없습니다.</p>
      )}
    </div>
  );
};

export default NotificationPopup;
