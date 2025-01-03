import { useState } from "react";

function SseTest() {
  const [messages, setMessages] = useState<string[]>([]);

  const onClick = () => {
    const eventSource = new EventSource(
      "http://localhost:8080/api/subscribe/1"
    );

    // notification 이벤트 수신
    eventSource.addEventListener("notification", (event) => {
      const message = (event as MessageEvent).data; // 이벤트 데이터 가져오기
      setMessages((prevMessages) => [...prevMessages, message]); // 상태 업데이트
    });

    // 오류 처리 및 연결 종료
    eventSource.onerror = () => {
      eventSource.close(); // 연결 닫기
    };
  };

  return (
    <>
      <button onClick={onClick}>click</button>
      <div className="App">
        <h1>Server-Sent Events</h1>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SseTest;
