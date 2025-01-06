import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminProvider"; // AdminContext 가져오기
import "../../styles/admin/AdminPage.css"; // AdminPage.css 파일을 임포트
import { format } from "date-fns";
import axios from "axios"; // axios 임포트
const apiUrl = import.meta.env.VITE_API_URL;

interface RequestDetailDto {
  requestId: string;
  requestUserId: string;
  requestType: string;
  requestContent: string;
  reportedUserId: string;
  requestDate: string;
  responseStatus: string;
  responseMessage: string;
  isOpen: boolean; // 상세 정보 표시 여부 추가
}

interface AdminResponseDto {
  responseStatus: string;
  responseMessage: string;
}

const AdminPage = () => {
  const { isAdmin, accessToken } = useContext(AdminContext)!; // 관리자인지 확인
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [requests, setRequests] = useState<RequestDetailDto[]>([]); // 요청 목록 (빈 배열로 초기화)
  const [responseMessage, setResponseMessage] = useState<string>(""); // 수락/거절 메시지 상태

  // 요청 목록 가져오기
  const fetchRequestList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/requests`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });

      // 응답이 배열인지 확인하고, 각 요청에 isOpen 상태를 추가
      if (Array.isArray(response.data)) {
        const requestsWithState = response.data.map(
          (request: RequestDetailDto) => ({
            ...request,
            isOpen: false, // 요청 목록의 각 요청은 기본적으로 상세 정보가 닫혀 있는 상태로 설정
          })
        );
        setRequests(requestsWithState); // 요청 목록을 상태에 저장
      } else {
        console.error("응답 데이터가 배열이 아닙니다:", response.data);
      }
    } catch (error) {
      console.error("요청 목록 가져오기 실패", error);
    } finally {
      setLoading(false); // 데이터 로딩 후 로딩 상태 해제
    }
  };

  // 관리자가 아닌 경우 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!isAdmin || !accessToken) {
      setLoading(false);
      fetchRequestList();
      // navigate("/signin"); // 관리자 아니거나 accessToken이 없으면 로그인 페이지로 리디렉션
    } else {
      setLoading(false); // 관리자인 경우 로딩 상태를 false로 변경
      fetchRequestList(); // 상태 업데이트 후 요청 목록 다시 가져오기
    }
  }, [isAdmin, accessToken, navigate]);

  // 요청 상세 정보 가져오기
  const fetchRequestDetail = async (requestId: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/admin/requests/${requestId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      console.log(response);
      // 상세 정보 불러오기 후 상태 업데이트
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requestId === requestId
            ? { ...request, isOpen: !request.isOpen } // 클릭 시 상세 정보 토글
            : { ...request, isOpen: false }
        )
      );
    } catch (error) {
      console.error("요청 상세 정보 조회 실패", error);
    }
  };

  // 요청 수락/거절 처리
  const handleUpdateRequestStatus = async (
    requestId: string,
    responseStatus: string,
    responseMessage: string
  ) => {
    const data: AdminResponseDto = { responseStatus, responseMessage };

    try {
      console.log(
        "handleUpdateRequestStatus() => responseStatus: ",
        responseStatus
      );
      await axios.patch(`${apiUrl}/api/admin/requests/${requestId}`, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });
      fetchRequestList(); // 상태 업데이트 후 요청 목록 다시 가져오기
    } catch (error) {
      console.error("요청 상태 업데이트 실패", error);
    }
  };

  // 메시지 입력 상태 관리
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseMessage(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중인 경우 표시
  }

  return (
    <div className="chatroom-list-container">
      <h1>Admin Page</h1>

      {/* 요청 목록 */}
      <div className="chatroom-list">
        <h2>요청 목록</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>요청 ID</th>
              <th>요청 분류</th>
              <th>요청 내용</th>
              <th>처리 상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.requestId}
                onClick={() => fetchRequestDetail(request.requestId)} // 표 행 클릭 시 상세 정보 토글
                style={{ cursor: "pointer" }}
              >
                <td>{request.requestId}</td>
                <td>{request.requestType}</td>
                <td>{request.requestContent}</td>
                <td>
                  <span
                    style={{
                      backgroundColor:
                        request.responseStatus === "PENDING"
                          ? "#FFD700"
                          : "#555", // pending -> yellow / 그 외 짙은 회색
                      color: "#fff", // 흰색 글씨
                      padding: "5px 10px",
                      borderRadius: "5px", // 둥근 모서리
                      fontSize: "0.9rem", // 적당한 크기
                    }}
                  >
                    {request.responseStatus}
                  </span>
                </td>
                <td>
                  {request.isOpen ? (
                    <span>▼</span> // 열려있는 경우 ▼ 표시
                  ) : (
                    <span>▶</span> // 닫혀있는 경우 ▶ 표시
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 요청 상세 정보 */}
      {requests.map(
        (request) =>
          request.isOpen && (
            <div
              key={request.requestId}
              className="request-detail"
              style={{
                backgroundColor: "#fff",
                borderRadius: "5px", // 둥근 모서리
                marginTop: "20px",
                padding: "20px",
              }}
            >
              {/* 요청 상세 정보 표 */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px", // 위쪽에 여백을 추가
                }}
              >
                <thead>
                  <tr>
                    <th>요청 ID</th>
                    <th>요청한 회원 ID</th>
                    <th>요청 분류</th>
                    <th>요청 내용</th>
                    <th>신고한 회원 ID</th>
                    <th>요청한 날짜</th>
                    <th>처리 상태</th>
                    <th>관리자 메시지</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{request.requestId}</td>
                    <td>{request.requestUserId}</td>
                    <td>{request.requestType}</td>
                    <td>
                      <span
                        style={{
                          display: "block", // 텍스트가 블록 요소로 처리되어 줄 바꿈을 할 수 있도록
                          wordWrap: "break-word", // 긴 단어가 자동으로 줄 바꿈되도록
                          whiteSpace: "normal", // 텍스트가 공백을 기준으로 줄 바꿈되도록
                        }}
                      >
                        {request.requestContent}
                      </span>
                    </td>
                    <td>{request.reportedUserId}</td>
                    <td>
                      {format(
                        new Date(request.requestDate),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </td>
                    <td>{request.responseStatus}</td>
                    <td>{request.responseMessage}</td>
                  </tr>
                </tbody>
              </table>

              {/* 수락/거절 메시지 입력란 */}
              <div style={{ marginTop: "20px" }}>
                <h4>관리자 메시지 입력란</h4>
                <input
                  type="text"
                  value={responseMessage}
                  onChange={handleMessageChange}
                  placeholder="응답 메세지를 입력해주세요."
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                  }}
                />
                <div>
                  <button
                    onClick={() =>
                      handleUpdateRequestStatus(
                        request.requestId,
                        "ACCEPTED",
                        responseMessage
                      )
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      borderRadius: "5px",
                      border: "none",
                      marginRight: "10px",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateRequestStatus(
                        request.requestId,
                        "DENIED",
                        responseMessage
                      )
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default AdminPage;
