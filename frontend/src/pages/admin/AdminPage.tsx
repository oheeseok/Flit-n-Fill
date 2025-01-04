import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminProvider"; // AdminContext 가져오기
import "../../styles/admin/AdminPage.css"; // AdminPage.css 파일을 임포트
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
            : request
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
    <div className="admin-page-container">
      <h1>Admin Page</h1>
      <p>Welcome to the Admin Page. Only accessible by admin users.</p>

      {/* 요청 목록 */}
      <div className="requests-list">
        <h2>Request List</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {requests.map((request) => (
            <li
              key={request.requestId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <button onClick={() => fetchRequestDetail(request.requestId)}>
                  {request.requestId}. [ {request.requestType} ] :{" "}
                  {request.requestContent}
                </button>
                <span
                  style={{
                    backgroundColor:
                      request.responseStatus === "PENDING" ? "#FFD700" : "#555", // pending -> yellow / 그 외 짙은 회색
                    color: "#fff", // 흰색 글씨
                    padding: "5px 10px",
                    borderRadius: "5px", // 둥근 모서리
                    fontSize: "0.9rem", // 적당한 크기
                  }}
                >
                  {request.responseStatus}
                </span>
              </div>

              {/* 요청 상세 정보 토글 */}
              {request.isOpen && (
                <div className="request-detail">
                  <p>
                    <strong>Request ID:</strong> {request.requestId}
                  </p>
                  <p>
                    <strong>User ID:</strong> {request.requestUserId}
                  </p>
                  <p>
                    <strong>Request Type:</strong> {request.requestType}
                  </p>
                  <p>
                    <strong>Request Content:</strong> {request.requestContent}
                  </p>
                  <p>
                    <strong>Reported User ID:</strong> {request.reportedUserId}
                  </p>
                  <p>
                    <strong>Request Date:</strong> {request.requestDate}
                  </p>
                  <p>
                    <strong>Response Status:</strong> {request.responseStatus}
                  </p>
                  <p>
                    <strong>Response Message:</strong> {request.responseMessage}
                  </p>

                  {/* 수락/거절 메시지 입력란 */}
                  <div>
                    <h4>Respond to Request</h4>
                    <input
                      type="text"
                      value={responseMessage}
                      onChange={handleMessageChange}
                      placeholder="응답 메세지를 입력해주세요."
                    />
                    <button
                      onClick={() =>
                        handleUpdateRequestStatus(
                          request.requestId,
                          "ACCEPTED",
                          responseMessage
                        )
                      }
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
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;