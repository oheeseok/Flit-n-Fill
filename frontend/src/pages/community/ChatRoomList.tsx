import React from "react";
import "../../styles/community/ChatRoomList.css";

interface ChatRoom {
  id: number;
  category: string;
  title: string;
  author: string;
  time: string;
  profileImage: string;
}

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    category: "[교환/분당구]",
    title: "당근 -> 버섯",
    author: "gahyeon",
    time: "2024.12.12 11:26",
    profileImage: "",
  },
  {
    id: 2,
    category: "[교환/분당구]",
    title: "당근 -> 파",
    author: "hanbyul",
    time: "2024.12.12 10:34",
    profileImage: "/images/profile2.jpg",
  },
  {
    id: 3,
    category: "[나눔/분당구]",
    title: "사과",
    author: "sangmin",
    time: "2024.12.12 11:34",
    profileImage: "/images/profile3.jpg",
  },
  {
    id: 4,
    category: "[나눔/분당구]",
    title: "소고기(한우 등심)",
    author: "changha",
    time: "2024.12.12 10:12",
    profileImage: "/images/profile4.jpg",
  },
];

const ChatRoomList: React.FC = () => {
  return (
    <div className="chatroom-list-container">
      <h2>거래방 목록</h2>
      <ul className="chatroom-list">
        {chatRooms.map((room) => (
          <li key={room.id} className="chatroom-item">
            <div className="chatroom-category">{room.category}</div>
            <div className="chatroom-content">
              <img
                src={room.profileImage}
                alt={room.author}
                className="chatroom-profile-image"
              />
              <div className="chatroom-details">
                <div className="chatroom-title">{room.title}</div>
                <div className="chatroom-author">{room.author}</div>
              </div>
              <div className="chatroom-time">{room.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRoomList;
