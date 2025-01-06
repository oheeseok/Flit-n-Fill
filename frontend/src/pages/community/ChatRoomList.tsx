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
            <div className="chatroom-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="chatroom-title" style={{ flex: "1" }}>{room.postTitle}</div>
              <div className="chatroom-info" style={{ flex: "1", display: "flex", alignItems: "center" }}>
                <div className="chatroom-details"  style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={room.otherUserProfile}
                    alt={room.otherUserNickname}
                    className="chatroom-profile-image"
                    style={{
                      width: "40px", // 원하는 이미지 크기 설정
                      height: "40px", // 원하는 이미지 크기 설정
                      borderRadius: "50%", // 동그란 이미지
                      marginRight: "10px", // 닉네임과 간격
                    }}
                  />
                  <div className="chatroom-author"><strong>{room.otherUserNickname}</strong></div>
                </div>
                <div className="chatroom-time" style={{ textAlign: "right" }}>
                  {format(new Date(room.lastMessageTime), "yyyy-MM-dd HH:mm:ss")}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
