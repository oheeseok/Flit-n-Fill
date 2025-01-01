import React from "react";
import "../../styles/community/ChatRoomAfter.css";

const ChatRoomAfter: React.FC = () => {
  return (
    <div className="chatroom-after-container">
      {/* 거래 사용자 정보 */}
      <div className="chatroom-after-header">
        <img
          src="/assets/profilesample.png"
          alt="User Profile"
          className="chatroom-after-profile-image"
        />
        <h2>oheeseok 님과의 거래</h2>
      </div>

      {/* 평가 영역 */}
      <div className="chatroom-after-feedback">
        <div className="chatroom-after-feedback-option">
          <img
            src="/assets/happy.png"
            alt="Happy"
            className="chatroom-after-feedback-image"
          />
          <p>최고예요!</p>
        </div>
        <div className="chatroom-after-feedback-option">
          <img
            src="/assets/sad.png"
            alt="Sad"
            className="chatroom-after-feedback-image"
          />
          <p>별로예요.</p>
        </div>
      </div>

      {/* 냉장고 상태 */}
      <div className="chatroom-after-fridge-status">
        <h3>내 냉장고 현황</h3>
        <p>당근 n개가 삭제되었습니다.</p>
        <p>버섯 n개가 추가되었습니다.</p>
      </div>
    </div>
  );
};

export default ChatRoomAfter;
