import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/community/ChatRoomList.css";
import { useChatRoom } from "../../context/ChatRoomContext";
import { format } from "date-fns";

const ChatRoomList: React.FC = () => {
  const { traderooms, getTradeRoomList } = useChatRoom();
  const navigate = useNavigate();

  // 거래방 목록 가져오기
  useEffect(() => {
    getTradeRoomList();
    console.log("Fetching traderooms...", traderooms);
  }, []);

  return (
    <div className="chatroom-list-container">
      <h2>거래방 목록</h2>
      <ul className="chatroom-list">
        {traderooms.map((room) => (
          <li
            key={room.tradeRoomId}
            className="chatroom-item"
            onClick={() => navigate(`/chatroom/${room.tradeRoomId}`)}
          >
            <div className="chatroom-content">
              <img
                src={room.otherUserProfile}
                alt={room.otherUserNickname}
                className="chatroom-profile-image"
              />
              <div className="chatroom-details">
                <div className="chatroom-title">{room.postTitle}</div>
                <div className="chatroom-author">{room.otherUserNickname}</div>
              </div>
              <div className="chatroom-time">
                {format(new Date(room.lastMessageTime), "yyyy-MM-dd HH:mm:ss")}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
