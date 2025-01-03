import React, { createContext, useContext, useState, useEffect } from "react";
import { useToastContext } from "./ToastContext";

const SSEContext = createContext<any>(null);

export const SSEProvider = ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useToastContext(); // Toast 메시지 추가 함수
  const [eventSources, setEventSources] = useState<Map<string, EventSource>>(
    new Map()
  );

  const startSSE = (url: string) => {
    // 이미 해당 URL에 대한 구독이 존재하면 구독을 하지 않음
    if (eventSources.has(url)) {
      console.log(`Already subscribed to ${url}`);
      return;
    }

    const es = new EventSource(url);

    // 연결이 성공적으로 이루어졌을 때
    es.onopen = () => {
      console.log("SSE Connection Established");
    };

    // es.onmessage = (event) => {
    //   console.log("SSE Message:", event.data);

    //   // 서버에서 보낸 메시지가 JSON 형식인 경우 파싱해서 사용
    //   try {
    //     const parsedData = JSON.parse(event.data);
    //     console.log("Parsed Data:", parsedData); // 파싱된 데이터 확인
    //     addToast(parsedData.message); // Toast 메시지 추가
    //   } catch (error) {
    //     console.error("Error parsing SSE message:", error);
    //     addToast(event.data); // 파싱할 수 없으면 원본 데이터를 그대로 Toast로 표시
    //   }

    //   // 메시지가 오면 alert로 띄우기 (디버깅 용)
    //   alert(`SSE Message: ${event.data}`);
    // };

    // 'notification' 이벤트 수신
    es.addEventListener("notification", (event) => {
      const message = (event as MessageEvent).data;
      console.log("SSE Message:", message);
      addToast(message); // Toast 메시지 추가
    });

    es.onerror = () => {
      console.error("SSE Error");
      es.close();
    };

    setEventSources((prev) => new Map(prev).set(url, es));
  };

  const stopSSE = (url: string) => {
    const es = eventSources.get(url);
    if (es) {
      es.close();
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
      const userUrl = `http://localhost:8080/api/subscribe/${userEmail}`;
      // userUrl에 대해 구독이 이미 되어 있는지 확인하고, 없으면 구독
      if (!eventSources.has(userUrl)) {
        startSSE(userUrl);
      }
    }

    // 컴포넌트 언마운트 시 SSE 종료
    return () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        stopSSE(`http://localhost:8080/api/subscribe/${userEmail}`);
      }
    };
  }, [eventSources]); // eventSources가 바뀔 때마다 useEffect가 트리거되도록

  return (
    <SSEContext.Provider value={{ startSSE, stopSSE }}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSEContext = () => useContext(SSEContext);
