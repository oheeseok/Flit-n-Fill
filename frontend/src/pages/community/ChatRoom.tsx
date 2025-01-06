import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { useChatRoom } from "../../context/ChatRoomContext";
import { useUser } from "../../context/UserContext"; // userId 조회 용도
import {
  TradeRoomMessageDto,
  OtherUserDto,
  PostSimpleDto,
} from "../../interfaces/TradeRoomInterfaces";

import { format } from "date-fns";
import { fromEnumToDescription } from "../../components/enum";
import "../../styles/community/ChatRoom.css";
const apiUrl = import.meta.env.VITE_API_URL;

const ChatRoom: React.FC = () => {
  const TRADE_COMPLETE = "COMPLETED";
  const TRADE_CANCEL = "CANCELED";

  const { tradeRoomId } = useParams<{ tradeRoomId: string }>();
  const { getTradeRoomDetail } = useChatRoom();
  // const [tradeProgress, setTradeProgress] = useState("");
  const [myInfo, setMyInfo] = useState<OtherUserDto | null>(null);
  const [otherUserInfo, setOtherUserInfo] = useState<OtherUserDto | null>(null);
  const [messages, setMessages] = useState<TradeRoomMessageDto[]>([]); // 초기값을 빈 배열로 설정
  const [newMessage, setNewMessage] = useState<string>("");
  const [postInfo, setPostInfo] = useState<PostSimpleDto | null>(null);

  const [visibleInfoIndex, setVisibleInfoIndex] = useState<number | null>(null); // 하나의 인덱스를 저장

  const [reportMessage, setReportMessage] = useState<string>("");

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
            setMessages(tradeRoomDetail.tradeRoomMessage);
            // setTradeProgress(tradeRoomDetail.tradeProgress);
            setMyInfo(tradeRoomDetail.myInfo);
            setOtherUserInfo(tradeRoomDetail.otherUserInfo);
            setPostInfo(tradeRoomDetail.postInfo);
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

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    // 이스케이프된 문자를 처리
    const encodedMessage = newMessage.replace(/\\"/g, '"'); // 문자열 내의 이스케이프된 문자 제거

    const newMessageObj: TradeRoomMessageDto = {
      userId: user?.userId ?? 0, // 현재 사용자 / user가 null일 경우 userId는 0으로 설정
      comment: encodedMessage,
      time: new Date(),
    };

    try {
      // HTTP POST 요청으로 서버에 메시지 전송
      const response = await axios.post(
        `${apiUrl}/api/trade/${tradeRoomId}`,
        encodedMessage,
        {
          headers: {
            "Content-Type": "text/plain", // 헤더 설정
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
          withCredentials: true, // 쿠키와 인증 정보를 포함하여 요청 보냄
        }
      );

      if (response.status === 201) {
        // 메시지 전송 성공 후 상태 업데이트
        setMessages((prevMessages) => [...prevMessages, newMessageObj]);
        setNewMessage(""); // 입력란 비우기
      } else {
        Swal.fire({
          icon: "error",
          title: "메시지 전송 실패",
          text: `나중에 다시 시도해 주세요.`,
        });
      }
    } catch (error) {
      console.error("Message sending error:", error);
      // 전송 실패 시 알림
      Swal.fire({
        icon: "error",
        title: "메시지 전송 실패",
        text: "메시지 전송에 실패했습니다. 나중에 다시 시도해 주세요.",
      });
    }
  };

  const handleTrade = async (tradeState: string) => {
    try {
      console.log(`handleTrade => ${tradeState}`);
      const response = await axios.patch(
        `${apiUrl}/api/trade/${tradeRoomId}`,
        tradeState,
        {
          headers: {
            "Content-Type": "text/plain", // 헤더 설정
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
          withCredentials: true, // 쿠키와 인증 정보를 포함하여 요청 보냄
        }
      );

      if (response.status === 204) {
        if (tradeState === TRADE_COMPLETE) {
          setTimeout(() => {
            navigate(`/feedback/${tradeRoomId}`);
          }, 2000);
        } else if (tradeState == TRADE_CANCEL) {
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "실패",
          text: `${response.data}`,
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("handleTrade error:", error);
        Swal.fire({
          icon: "error",
          text: `${error.response?.data}`,
        }).then(() => {
          navigate(`/community/list`); // 확인 버튼 클릭 후 네비게이트 실행
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

  const reportUser = async () => {
    // if (reportMessage.trim() === "") {
    //   console.log("reportUser() reportMessage.trim() return");
    //   return;
    // }

    // 이스케이프된 문자를 처리
    const encodedMessage = reportMessage.replace(/\\"/g, '"'); // 문자열 내의 이스케이프된 문자 제거

    const reportMessageObj = {
      userId: otherUserInfo?.userId,
      reportReason: encodedMessage,
    };

    try {
      console.log(`reportUser()`);
      const response = await axios.post(
        `${apiUrl}/api/user/report`,
        reportMessageObj,
        {
          headers: {
            "Content-Type": "application/json", // 헤더 설정
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
          withCredentials: true, // 쿠키와 인증 정보를 포함하여 요청 보냄
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          text: `신고처리가 완료되었습니다!`,
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("reportUser error:", error);
        Swal.fire({
          icon: "error",
          text: `${error.response?.data}`,
        }).then(() => {
          navigate(`/chatroomlist`); // 확인 버튼 클릭 후 네비게이트 실행
        });
      } else {
        console.error("An unknown error occurred:", error);
        Swal.fire({
          icon: "error",
          text: "신고가 정상적으로 이루어지지 않았습니다.",
        });
      }
    }
  };

  const handleReportButtonClick = () => {
    // 신고하기 버튼 클릭 시 Swal로 신고 사유 입력 받기
    Swal.fire({
      title: "신고 사유를 입력하세요",
      input: "textarea",
      inputPlaceholder: "신고 사유를 입력해주세요.",
      showCancelButton: true,
      confirmButtonText: "신고하기",
      cancelButtonText: "취소",
      inputAttributes: {
        style: "resize: none;", // resize none을 추가
      },
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("신고 사유를 입력해주세요.");
          return false;
        }
        setReportMessage(inputValue); // 입력된 신고 사유를 상태에 저장
        return inputValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        reportUser(); // 신고하기 함수 호출
      }
    });
  };

  // 프로필 클릭 시, 해당 인덱스에 대한 토글을 처리
  const handleProfileClick = (index: number) => {
    setVisibleInfoIndex((prevIndex) => (prevIndex === index ? null : index)); // 클릭한 인덱스가 이미 보이고 있으면 숨기고, 아니면 보여주기
  };

  const handleWidgetClick = (e: React.MouseEvent, index: number) => {
    // 클릭된 위젯이 이미 보이고 있으면 닫고, 아니면 열기
    e.stopPropagation(); // 프로필 클릭 이벤트와 겹치지 않도록 이벤트 전파를 막음
    setVisibleInfoIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handlePostClick = () => {
    if (postInfo) {
      navigate(`/community/detail/${postInfo.postId}`);
    }
  };

  return (
    <div className="chatroom-container">
      {/* 채팅방 헤더 */}
      <div className="chatroom-header">
        <h2>
          <span
            className={`progress-text ${
              postInfo?.progress === "IN_PROGRESS"
                ? "progress-inprogress"
                : postInfo?.progress === "COMPLETED"
                ? "progress-completed"
                : postInfo?.progress === "CANCELED"
                ? "progress-canceled"
                : "progress-pending"
            }`}
          >
            {fromEnumToDescription(postInfo?.progress ?? "")}
          </span>
          {postInfo ? (
            <span
              className="post-title"
              onClick={handlePostClick}
              style={{ cursor: "pointer" }}
            >
              [{fromEnumToDescription(postInfo.tradeType)}/{postInfo.address}]{" "}
              {postInfo.postTitle}
            </span>
          ) : (
            ""
          )}
        </h2>
        <div className="chatroom-header-info">
          <div className="user-info">
            <img
              src={postInfo?.userProfile}
              alt={postInfo?.userNickname}
              className="chatroom-profile-image"
            />
            <div className="nickname-time">
              <span className="nickname">{postInfo?.userNickname}</span>
              <span className="post-time">
                {postInfo?.postCreatedDate
                  ? format(
                      new Date(postInfo.postCreatedDate),
                      "yyyy-MM-dd HH:mm:ss"
                    )
                  : ""}
              </span>
            </div>
          </div>
          <div className="button-group">
            <button
              className="chatroom-send-button"
              onClick={() => handleTrade(TRADE_COMPLETE)}
              style={{ backgroundColor: "#4CAF50", color: "white" }}
            >
              거래완료
            </button>
            <button
              className="chatroom-send-button trade-cancel"
              onClick={() => handleTrade(TRADE_CANCEL)}
              style={{ backgroundColor: "#f44336", color: "white" }}
            >
              거래취소
            </button>
            <button
              className="chatroom-send-button report"
              onClick={handleReportButtonClick}
              style={{ backgroundColor: "#FF9800", color: "white" }}
            >
              신고하기
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div className="chatroom-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chatroom-message ${
              message.userId === user?.userId ? "my-message" : "other-message"
            }`}
          >
            <div className="chatroom-message-container">
              <div className="chatroom-user-info">
                <div
                  className="chatroom-profile-image"
                  onClick={() => handleProfileClick(index)} // 클릭된 인덱스를 전달
                >
                  <img
                    src={
                      message.userId === user?.userId
                        ? myInfo?.userProfile
                        : otherUserInfo?.userProfile
                    }
                    className="chatroom-profile-image"
                  />
                </div>
                {/* 클릭한 인덱스에 해당하는 프로필 정보만 보이도록 조건부 렌더링 */}
                <div
                  className={`profile-info-widget ${
                    visibleInfoIndex === index ? "open" : ""
                  }`}
                  onClick={(e) => handleWidgetClick(e, index)}
                >
                  <img
                    src={
                      message.userId === user?.userId
                        ? myInfo?.userProfile
                        : otherUserInfo?.userProfile
                    }
                    className="chatroom-profile-image"
                  />
                  <p>
                    {message.userId === user?.userId
                      ? myInfo?.userNickname
                      : otherUserInfo?.userNickname}
                    님
                  </p>
                  <p>
                    {message.userId === user?.userId
                      ? myInfo?.userAddress
                      : otherUserInfo?.userAddress}
                  </p>
                  <p>
                    Fevel .
                    {message.userId === user?.userId
                      ? myInfo?.userKindness
                      : otherUserInfo?.userKindness}
                  </p>
                </div>
                <div className="chatroom-message-author">
                  {message.userId === user?.userId
                    ? myInfo?.userNickname
                    : otherUserInfo?.userNickname}
                </div>
              </div>
              <div className="chatroom-message-content-container">
                <div className="chatroom-message-content">
                  {message.comment}
                </div>
                <div className="chatroom-message-time">
                  {format(new Date(message.time), "yyyy-MM-dd HH:mm:ss")}
                </div>
              </div>
            </div>
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
        <button
          className="chatroom-send-button"
          onClick={handleSendMessage}
          style={{ backgroundColor: "#85b573", color: "white" }}
        >
          입력하기
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
