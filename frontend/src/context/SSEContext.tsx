import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useToastContext } from "./ToastContext";
const apiUrl = import.meta.env.VITE_API_URL;

const SSEContext = createContext<any>(null);

export const SSEProvider = ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useToastContext(); // Toast 메시지 추가 함수
  const [eventSources, setEventSources] = useState<Map<string, EventSource>>(
    new Map()
  );
  const [isConnected, setIsConnected] = useState<boolean>(false); // 연결 상태 관리

  const startSSE = (url: string) => {
    // 이미 해당 URL에 대한 구독이 존재하면 구독을 하지 않음
    if (eventSources.has(url)) {
      console.log(`Already subscribed to ${url}`);
      return;
    }

    let es: EventSource | null = new EventSource(url, {
      withCredentials: true,
    });

    // 연결이 성공적으로 이루어졌을 때
    es.onopen = () => {
      console.log("SSE Connection Established");
      setIsConnected(true); // 연결 상태 true로 설정
    };

    // 'connect' 이벤트 수신
    es.addEventListener("connect", (event) => {
      const message = (event as MessageEvent).data;
      console.log("SSE First Connect Message:", message);
    });

    // 'notification' 이벤트 수신
    es.addEventListener("notification", (event) => {
      const message = (event as MessageEvent).data;
      console.log("SSE Message:", message);
      addToast(message); // Toast 메시지 추가
    });

    // 연결 오류 발생 시 재연결 시도
    es.onerror = (error) => {
      console.error("SSE Error: ", error);
      es?.close(); // 기존 연결 종료
      setIsConnected(false); // 연결 상태 false로 설정

      // 재연결 시도 (재연결 간격 5초)
      setTimeout(() => {
        console.log("Reconnecting to SSE...");
        startSSE(url);
      }, 5000);
    };

    setEventSources((prev) => new Map(prev).set(url, es));
  };

  const stopSSE = async (url: string) => {
    const es = eventSources.get(url);
    if (es) {
      es.close();
      console.log("SSE stopSSE");

      try {
        const response = await axios.delete(url, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        });
        if (response.status === 204) {
          console.log("Successfully unsubscribed");
        }
      } catch (error) {
        console.error("Error while unsubscribing:", error);
      }

      setEventSources((prev) => {
        const newMap = new Map(prev);
        newMap.delete(url);
        return newMap;
      });
    }
  };

  // 페이지 새로고침 시 로그인 상태 확인 후 SSE 연결 유지
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userEmail = localStorage.getItem("userEmail");

    if (accessToken && userEmail) {
      const userUrl = `${apiUrl}/api/subscribe/${userEmail}`;
      // userUrl에 대해 구독이 이미 되어 있는지 확인하고, 없으면 구독
      if (!eventSources.has(userUrl)) {
        startSSE(userUrl);
      }
    }

    // 컴포넌트 언마운트 시 SSE 종료
    return () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        console.log("컴포넌트 언마운트 시 SSE 종료");
        stopSSE(`${apiUrl}/api/subscribe/${userEmail}`);
      }
    };
  }, []); // 의존성을 빈 배열로 설정하여 한 번만 실행되도록 수정

  return (
    <SSEContext.Provider value={{ startSSE, stopSSE, isConnected }}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSEContext = () => useContext(SSEContext);
