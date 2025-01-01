import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminProvider"; // AdminContext 가져오기
import "../../styles/admin/AdminPage.css"; // AdminPage.css 파일을 임포트
import axios from "axios"; // axios 임포트

interface RequestDetailDto {
    requestId: string;
    requestUserId: string;
    requestType: string;
    requestContent: string;
    reportedUserId: string;
    requestDate: string;
    responseStatus: string;
    responseMessage: string;
}

interface AdminResponseDto {
    responseStatus: string;
    responseMessage: string;
}

const AdminPage = () => {
    const { isAdmin } = useContext(AdminContext)!; // 관리자인지 확인
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [requests, setRequests] = useState<RequestDetailDto[]>([]); // 요청 목록 (빈 배열로 초기화)
    const [selectedRequest, setSelectedRequest] = useState<RequestDetailDto | null>(null); // 선택된 요청 상세 정보

    // 요청 목록 가져오기
    const fetchRequestList = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/requests", {
                withCredentials: true, // 쿠키와 같은 인증 정보를 자동으로 보내도록 설정
            });

            // 응답이 배열인지 확인
            if (Array.isArray(response.data)) {
                setRequests(response.data); // 요청 목록을 상태에 저장
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
        if (!isAdmin) {
            // navigate("/signin"); // 관리자 아니면 로그인 페이지로 리디렉션 (주석 처리)
            setLoading(false);
        } else {
            setLoading(false); // 관리자인 경우 로딩 상태를 false로 변경
            fetchRequestList(); // 요청 목록을 가져옵니다.
        }
    }, [isAdmin, navigate]);

    // 요청 상세 정보 가져오기
    const fetchRequestDetail = async (requestId: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/requests/${requestId}`, {
                withCredentials: true, // 쿠키와 같은 인증 정보를 자동으로 보내도록 설정
            });
            setSelectedRequest(response.data); // 요청 상세 정보를 상태에 저장
        } catch (error) {
            console.error("요청 상세 정보 조회 실패", error);
        }
    };

    // 요청 수락/거절 처리
    const handleUpdateRequestStatus = async (requestId: string, responseStatus: string, responseMessage: string) => {
        const data: AdminResponseDto = { responseStatus, responseMessage };

        try {
            await axios.patch(`http://localhost:8080/api/admin/requests/${requestId}`, data, {
                withCredentials: true, // 쿠키와 같은 인증 정보를 자동으로 보내도록 설정
            }); // 요청 상태 업데이트
            fetchRequestList(); // 상태 업데이트 후 요청 목록 다시 가져오기
            setSelectedRequest(null); // 요청 수락/거절 후 상세 정보 초기화
        } catch (error) {
            console.error("요청 상태 업데이트 실패", error);
        }
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
                <ul>
                    {requests.map((request) => (
                        <li key={request.requestId}>
                            <button onClick={() => fetchRequestDetail(request.requestId)}>
                                {request.requestId}: {request.requestUserId}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 요청 상세 정보 */}
            {selectedRequest && (
                <div className="request-detail">
                    <h3>Request Detail</h3>
                    <p><strong>Request ID:</strong> {selectedRequest.requestId}</p>
                    <p><strong>User ID:</strong> {selectedRequest.requestUserId}</p>
                    <p><strong>Request Type:</strong> {selectedRequest.requestType}</p>
                    <p><strong>Request Content:</strong> {selectedRequest.requestContent}</p>
                    <p><strong>Reported User ID:</strong> {selectedRequest.reportedUserId}</p>
                    <p><strong>Request Date:</strong> {selectedRequest.requestDate}</p>
                    <p><strong>Response Status:</strong> {selectedRequest.responseStatus}</p>
                    <p><strong>Response Message:</strong> {selectedRequest.responseMessage}</p>

                    {/* 수락/거절 버튼 */}
                    <div>
                        <h4>Respond to Request</h4>
                        <button
                            onClick={() =>
                                handleUpdateRequestStatus(selectedRequest.requestId, "ACCEPTED", "Request accepted.")
                            }
                        >
                            Accept
                        </button>
                        <button
                            onClick={() =>
                                handleUpdateRequestStatus(selectedRequest.requestId, "REJECTED", "Request rejected.")
                            }
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;


//     return (
//         <div className="admin-page-container"> {/* AdminPage 스타일 적용 */}
//             <h1>Admin Page</h1>
//             <p>Welcome to the Admin Page. Only accessible by admin users.</p>
//             {/* 여기에 관리자 전용 콘텐츠를 추가하세요 */}
//             <div className="content">
//                 <button className="btn">Go to Dashboard</button>
//             </div>
//         </div>
//     );
// };

// export default AdminPage;