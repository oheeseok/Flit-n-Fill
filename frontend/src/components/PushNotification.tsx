import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // UserContext import

const PushNotification = () => {
  const { user, logout } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // 로그인 상태에서 SSE 구독 설정
  useEffect(() => {
    if (user) {
      console.log("SSE 구독 시작");
      const es = new EventSource(
        `http://localhost:8080/api/subscribe/${user.userId}`
      ); // SSE 연결
      setEventSource(es);

      es.onmessage = (event) => {
        // SSE로 받은 알림 처리
        setNotifications((prev) => [...prev, event.data]);
      };

      return () => {
        // 컴포넌트가 언마운트 될 때 SSE 구독 해지
        es.close();
      };
    }
  }, [user]);

  // 로그아웃 시 SSE 구독 해지
  useEffect(() => {
    if (!user && eventSource) {
      eventSource.close(); // SSE 구독 해지
      setEventSource(null);
    }
  }, [user]);

  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index}>{notification}</div>
      ))}
    </div>
  );
};

export default PushNotification;
