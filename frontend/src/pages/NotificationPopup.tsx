import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/common/NotificationPopup.css";
import { useNotification } from "../context/NotificationContext";
import { NotificationViewDto } from "../interfaces/NotificationInterfaces";
import { fromEnumToDescription } from "../components/enum";

interface NotificationPopupProps {
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  setShowNotification,
}) => {
  const { notifications, getNotificationList, markAllAsRead } =
    useNotification();

  const popupRef = useRef<HTMLDivElement>(null); // 팝업 영역을 참조하기 위한 ref

  // 알림 목록 가져오기
  useEffect(() => {
    getNotificationList();
    console.log("Fetching notifications...", notifications);
  }, []);

  // 읽지 않은 알림 필터링
  const unreadNotifications = notifications.filter(
    (notification) => !notification.notificationIsRead
  );

  // 팝업 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowNotification]);

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
