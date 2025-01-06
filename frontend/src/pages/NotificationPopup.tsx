import React, { useEffect, useRef } from "react";
import "../styles/common/NotificationPopup.css";
import { useNotification } from "../context/NotificationContext";
import { fromEnumToDescription } from "../components/enum";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

interface NotificationPopupProps {
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  setShowNotification,
}) => {
  const RESPONSE_ACCEPT = "ACCEPTED";
  const RESPONSE_DENY = "DENIED";
  const {
    notifications,
    getNotificationList,
    markAllAsRead,
    markAsRead,
    deleteOneNotification,
    deleteAllNotifications,
  } = useNotification();

  const popupRef = useRef<HTMLDivElement>(null); // 팝업 영역을 참조하기 위한 ref

  // 알림 목록 가져오기
  useEffect(() => {
    getNotificationList();
    console.log("Fetching notifications...", notifications);
  }, []);

  // 팝업 외부 클릭 시 팝업 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowNotification(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRequest = async (state: string, notificationId: number) => {
    try {
      console.log(
        `handleRequest => ${state}, notificationId: ${notificationId}`
      );

      // 로딩 상태 표시
      Swal.fire({
        title: "처리 중...",
        html: "<div class='spinner'></div>", // 커스텀 로딩 애니메이션
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(); // 기본 로딩 애니메이션 표시
        },
      });

      const response = await axios.patch(
        `${apiUrl}/api/notifications/${notificationId}`,
        state,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      if (response.status === 204) {
        const text =
          state === RESPONSE_ACCEPT
            ? "요청을 수락했습니다!"
            : "요청을 거절했습니다!";
        Swal.fire({
          icon: "success",
          text: text,
        }).then(async () => {
          try {
            await deleteOneNotification(notificationId);
          } catch (error) {
            console.error("deleteOneNotification error:", error);
            Swal.fire({
              icon: "error",
              text: "알림 삭제 처리 중 오류가 발생했습니다.",
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          // title: "실패",
          text: `${response.data}`,
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("handleRequest error:", error);
        Swal.fire({
          icon: "error",
          // title: "실패",
          text: `${error.response?.data}`,
        });
      } else {
        console.error("An unknown error occurred:", error);
        Swal.fire({
          icon: "error",
          text: "서버 오류입니다",
        });
      }
    }
  };

  const handleDelete = async (notificationId: number, isRead: boolean) => {
    if (!isRead) {
      // 알림이 읽지 않은 상태일 때 삭제 확인 메시지
      Swal.fire({
        title: "아직 확인하지 않은 알림입니다.",
        text: "정말 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteOneNotification(notificationId);
        }
      });
    } else {
      // 읽은 알림은 바로 삭제
      deleteOneNotification(notificationId);
    }
  };

  const handleDeleteAll = async () => {
    // 읽지 않은 알림이 있는지 확인
    const unreadNotifications = notifications.filter(
      (notification) => !notification.notificationIsRead
    );

    if (unreadNotifications.length > 0) {
      Swal.fire({
        title: "아직 확인하지 않은 알림이 있습니다.",
        text: "정말 전체 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "전체 삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAllNotifications();
        }
      });
    } else {
      // 읽은 알림만 있을 때는 바로 삭제
      deleteAllNotifications();
    }
  };
  return (
    <div
      className="notification-popup"
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="notification-header">
        <button onClick={() => markAllAsRead()}>전체 읽음</button>
        <button onClick={handleDeleteAll}>전체 삭제</button>
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`notification-item ${
                notification.notificationIsRead ? "read" : "unread"
              }`}
            >
              <p>
                [{fromEnumToDescription(notification.notificationType)} 알림]
              </p>

              {/* NEW_COMMENT 알림에 대해 텍스트를 클릭할 수 있는 링크로 변경 */}
              {notification.notificationType === "NEW_COMMENT" ? (
                <p>
                  <Link
                    to={`/chatroom/${notification.tradeRoomId}`}
                    className="notification-link"
                  >
                    {notification.notificationMessage}
                    {/* 알림 메시지를 클릭 가능한 링크로 설정 */}
                  </Link>
                </p>
              ) : (
                <p>
                  <span>{notification.notificationMessage}</span>
                </p>
              )}

              {/* TRADE_REQUEST_RESULT 또는 SHARE_REQUEST_RESULT 타입일 때만 "거래방으로 이동" 링크 추가 */}
              {(notification.notificationType === "TRADE_REQUEST_RESULT" ||
                notification.notificationType === "SHARE_REQUEST_RESULT") && (
                <p>
                  <Link
                    to={`/chatroom/${notification.tradeRoomId}`}
                    className="notification-link"
                  >
                    거래방으로 이동
                  </Link>
                </p>
              )}
              {!notification.notificationIsRead && (
                <button
                  className="mark-as-read-button"
                  onClick={() => markAsRead(notification.notificationId)}
                >
                  읽음
                </button>
              )}
              <div className="notification-button">
                <button
                  className="notification-button-delete"
                  onClick={() =>
                    handleDelete(
                      notification.notificationId,
                      notification.notificationIsRead
                    )
                  }
                >
                  삭제
                </button>
                {(notification.notificationType === "TRADE_REQUEST" ||
                  notification.notificationType === "SHARE_REQUEST") && (
                  <div>
                    <button
                      className="notification-button-accept"
                      onClick={() =>
                        handleRequest(
                          RESPONSE_ACCEPT,
                          notification.notificationId
                        )
                      }
                    >
                      수락
                    </button>
                    <button
                      className="notification-button-deny"
                      onClick={() =>
                        handleRequest(
                          RESPONSE_DENY,
                          notification.notificationId
                        )
                      }
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>새 알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
