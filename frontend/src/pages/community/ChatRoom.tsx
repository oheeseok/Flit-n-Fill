import React, { useState } from "react";
import "../../styles/community/ChatRoom.css";

interface Message {
  id: number;
  author: string;
  content: string;
  time: string;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "gahyeon",
      content: "안녕하세요.",
      time: "2024.12.12 10:41",
    },
    {
      id: 2,
      author: "oheeseok",
      content: "안녕하세요.",
      time: "2024.12.12 10:41",
    },
    {
      id: 3,
      author: "gahyeon",
      content: "저 평이 버섯인데 교환 가능할까요?",
      time: "2024.12.12 10:41",
    },
    {
      id: 4,
      author: "oheeseok",
      content: "물론이죠. 소비기한은 언제까지인가요?",
      time: "2024.12.12 10:41",
    },
    {
      id: 5,
      author: "gahyeon",
      content: "일주일 뒤예요!",
      time: "2024.12.12 10:41",
    },
    {
      id: 6,
      author: "oheeseok",
      content: "넵! 좋아요 7시 20분까지 서현역에서 뵈요!",
      time: "2024.12.12 10:41",
    },
  ]);

  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMessageObj: Message = {
      id: messages.length + 1,
      author: "oheeseok", // 현재 사용자
      content: newMessage,
      time: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage("");
  };

  return (
    <div className="chatroom-container">
      {/* 채팅방 헤더 */}
      <div className="chatroom-header">
        <h2>[교환/분당구] 당근 - 버섯</h2>
        <div className="chatroom-header-info">
          <span>gahyeon</span>
          <span>2024.12.12 10:41</span>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div className="chatroom-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chatroom-message ${
              message.author === "oheeseok" ? "my-message" : "other-message"
            }`}
          >
            <div className="chatroom-message-author">{message.author}</div>
            <div className="chatroom-message-content">{message.content}</div>
            <div className="chatroom-message-time">{message.time}</div>
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="chatroom-footer">
        <textarea
          className="chatroom-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="댓글을 남겨 보세요."
        />
        <button className="chatroom-send-button" onClick={handleSendMessage}>
          입력하기
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
