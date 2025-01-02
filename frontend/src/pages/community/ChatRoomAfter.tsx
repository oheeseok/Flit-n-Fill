import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { useChatRoom } from "../../context/ChatRoomContext";
import { useUser } from "../../context/UserContext"; // userId 조회 용도
import { OtherUserDto } from "../../interfaces/TradeRoomInterfaces";
import "../../styles/community/ChatRoomAfter.css";

const ChatRoomAfter: React.FC = () => {
  const FEEDBACK_GREAT = "GREAT";
  const FEEDBACK_BAD = "BAD";

  const { tradeRoomId } = useParams<{ tradeRoomId: string }>();
  const { getTradeRoomDetail } = useChatRoom();
  const [otherUserInfo, setOtherUserInfo] = useState<OtherUserDto | null>(null);

  const { user, fetchUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTradeRoomDetail = async () => {
      if (tradeRoomId) {
        try {
          const tradeRoomDetail = await getTradeRoomDetail(tradeRoomId);

          if (!tradeRoomDetail) {
            // tradeRoomId에 해당하는 데이터가 없을 경우 Swal로 알림을 띄운 후 리디렉션
            Swal.fire({
              icon: "error",
              title: "해당 채팅방을 찾을 수 없습니다.",
              text: "채팅방 목록으로 이동합니다.",
              confirmButtonText: "확인",
            }).then(() => {
              navigate("/chatroomlist"); // 채팅방 목록 페이지로 이동
            });
          } else {
            console.log("TradeRoom Detail:", tradeRoomDetail);
            setOtherUserInfo(tradeRoomDetail.otherUserInfo);
          }
        } catch (error) {
          console.error("Error fetching trade room detail:", error);
          // 오류 발생 시 Swal로 알림을 띄운 후 리디렉션
          Swal.fire({
            icon: "error",
            title: "채팅방 정보 가져오기 중 오류가 발생했습니다.",
            text: "채팅방 목록으로 이동합니다.",
            confirmButtonText: "확인",
          }).then(() => {
            navigate("/chatroomlist"); // 채팅방 목록 페이지로 이동
          });
        }
      }
    };

    fetchTradeRoomDetail();
  }, [tradeRoomId, getTradeRoomDetail, navigate]);

  useEffect(() => {
    const initializeUserData = async () => {
      if (!user) {
        await fetchUserData(); // DB에서 사용자 데이터 가져오기
      }
    };

    initializeUserData();
  }, [user, fetchUserData]);

  const handleFeedback = async (feedbackState: string) => {
    try {
      console.log(`handleFeedback => ${feedbackState}`);
      const response = await axios.post(
        `http://localhost:8080/api/trade/${tradeRoomId}/kindness`,
        feedbackState,
        {
          headers: {
            "Content-Type": "text/plain", // 헤더 설정
          },
          withCredentials: true, // 쿠키와 인증 정보를 포함하여 요청 보냄
        }
      );

      if (response.status === 204) {
        Swal.fire({
          icon: "success",
          title: "피드백 완료",
          text: "피드백을 남겨주셔서 감사합니다!",
        });
        // if (feedbackState === FEEDBACK_GREAT || feedbackState == FEEDBACK_BAD) {
        //   setTimeout(() => {
        //     navigate(`/feedback/${tradeRoomId}`);
        //   }, 2000);
        // }
      } else {
        Swal.fire({
          icon: "error",
          // title: "실패",
          text: `${response.data}`,
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("handleFeedback error:", error);
        Swal.fire({
          icon: "error",
          // title: "실패",
          text: `${error.response?.data}`,
        }).then(() => {
          navigate("/");
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

  return (
    <div className="chatroom-after-container">
      {/* 거래 사용자 정보 */}
      <div className="chatroom-after-header">
        <img
          src={otherUserInfo?.userProfile}
          alt="Other User Profile"
          className="chatroom-after-profile-image"
        />
        <h2>{otherUserInfo?.userNickname} 님과의 거래는 어떠셨나요?</h2>
      </div>

      {/* 평가 영역 */}
      <div className="chatroom-after-feedback">
        <div className="chatroom-after-feedback-option">
          <img
            src="/assets/happy.png"
            alt="Happy"
            className="chatroom-after-feedback-image"
            onClick={() => handleFeedback(FEEDBACK_GREAT)}
          />
          <p>최고예요!</p>
        </div>
        <div className="chatroom-after-feedback-option">
          <img
            src="/assets/sad.png"
            alt="Sad"
            className="chatroom-after-feedback-image"
            onClick={() => handleFeedback(FEEDBACK_BAD)}
          />
          <p>별로예요.</p>
        </div>
      </div>

      {/* 냉장고 상태 */}
      <div className="chatroom-after-fridge-status">
        {/* <h3>내 냉장고 현황</h3>
        <p>당근 n개가 삭제되었습니다.</p>
        <p>버섯 n개가 추가되었습니다.</p> */}
        <h2
          onClick={() => navigate("/fridge")}
          style={{ cursor: "pointer", color: "blue" }}
        >
          냉장고로 이동해서 거래한 내용을 업데이트 하세요!
        </h2>
      </div>
    </div>
  );
};

export default ChatRoomAfter;
