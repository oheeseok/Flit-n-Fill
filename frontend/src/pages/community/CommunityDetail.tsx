import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // SweetAlert2 추가
import axios from "axios";
// import { useCommunity } from "../../context/CommunityContext";
import "../../styles/community/CommunityDetail.css";

interface PostDetailDto {
  postId: number;
  postTitle: string;
  postContent: string;
  postPhoto1: string;
  tradeType: "SHARING" | "EXCHANGE";
  postCreatedDate: Date;
  meetingPlace: string;
  meetingTime: string;
  writerFoodId: number;
  proposerFoodListId: number;
  userNickname: string;
  userProfile: string;
  address: string;
  progress: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}

const CommunityDetail = () => {
  // const { communityData, setCommunityData } = useCommunity(); // 데이터와 설정 함수 가져오기
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>()  // URL에서 postId 가져오기
  const [postDetail, setPostDetail] = useState<PostDetailDto | null>(null)

  // if (!communityData) {
  //   return <div>데이터가 없습니다. 다시 시도해주세요.</div>;
  // }

  // const data: PostDetailDto = communityData as PostDetailDto

  // const {
  //   postTitle,
  //   postContent,
  //   meetingPlace,
  //   meetingTime,
  //   postPhoto1,
  //   tradeType,
  //   writerFoodId,
  //   proposerFoodListId,
  // } = data;

  // 게시글 상세 데이터 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get<PostDetailDto>(`/api/posts/${postId}`, {
          withCredentials: true,
        });
        setPostDetail(response.data);
      } catch (error) {
        console.error("게시글 상세 데이터 가져오기 실패:", error);
        Swal.fire("오류", "게시글 상세 데이터를 가져오는 데 실패했습니다.", "error").then(
          () => {
            navigate("/community");
          }
        );
      }
    };

    if (postId) {
      fetchPostDetail();
    }
  }, [postId, navigate]);

  if (!postDetail) {
    return <div>로딩 중입니다...</div>;
  }

  const handleRequest = async () => {
    try {
      // 요청 데이터 생성
      const actionRequest = {
        action: "REQUEST",
      };
  
      await axios.post(`/api/posts/${postId}/request`, actionRequest, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      Swal.fire("요청 성공", "요청이 성공적으로 처리되었습니다!", "success");
    } catch (error) {
      console.error("요청 실패:", error);
      Swal.fire("요청 실패", "요청 처리 중 오류가 발생했습니다.", "error").then(
        () => {
          navigate(`/community/detail/${postId}`);
        }
      );
    }
  };

  const handleEdit = () => {
    navigate("/community/edit"); // 수정 페이지?로 이동
  };

  const handleDelete = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제하면 데이터를 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // 데이터 삭제 처리
        try {
          await axios.delete(`/api/posts/${postId}`, {
            withCredentials: true,
          });

        // setCommunityData(null); // Context에서 데이터 초기화
          Swal.fire("삭제 완료", "데이터가 삭제되었습니다.", "success").then(
            () => {
              navigate("/community"); // 삭제 후 /community로 이동
            }
          );
        } catch (error) {
          console.error("게시글 삭제 실패:", error);
          Swal.fire("삭제 실패", "게시물 삭제 중 오류가 발생했습니다.", "error");
        }
      }
    });
  };

  return (
    <div className="community-detail-body">
      {/* 교환/나눔 표시 */}
      <div className="community-detail-category">
        [{postDetail.tradeType === "EXCHANGE" ? "교환" : "나눔"}]
      </div>

      {/* 제목 표시 */}
      <div className="community-detail-title">{postDetail.postTitle}</div>

      {/* 작성자 정보 */}
      <div className="community-detail-profile-container">
        <div className="community-detail-profile-container-profile">
          {postDetail.userProfile ? (
                <img
                  className="community-detail-profile-container-profile"
                  src={postDetail.userProfile}
                />
              ) : (
                <p>프로필 이미지 없음</p>
              )}
        </div>
        <div className="community-detail-profile-container-name">{postDetail.userNickname || "알 수 없음"}</div>
        <div className="community-detail-profile-container-time">
          {new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(postDetail.meetingTime))}
        </div>
        <div className="community-detail-button-container">
          <button className="community-detail-edit-button" onClick={handleEdit}>
            수정
          </button>
          <button
            className="community-detail-delete-button"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>

      {/* 업로드된 이미지 */}
      <div className="community-detail-img">
        {postDetail.postPhoto1 ? (
          <img src={postDetail.postPhoto1} alt="첫 번째 이미지" />
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      {/* 내용 표시 */}
      <div className="community-detail-box-container">
        <div className="community-detail-box-input">{postDetail.postContent}</div>
      </div>

      {/* 만남 장소 표시 */}
      <div className="community-detail-box-container">
        <strong>만남 장소:</strong> {postDetail.meetingPlace}
      </div>

      {/* 작성자/제안자 음식 ID 표시 */}
      <div className="community-detail-box-container">
        <strong>작성자의 재료 ID:</strong> {postDetail.writerFoodId}
      </div>
      <div className="community-detail-box-container">
        <strong>교환 원하는 재료 ID:</strong> {postDetail.proposerFoodListId}
      </div>

      {/* 요청 버튼 */}
      <div className="community-detail-button-container2">
        {postDetail.progress === "PENDING" ? (
          <button
            className="community-detail-button"
            onClick={handleRequest}
          >
            요청하기
          </button>
        ) : postDetail.progress === "IN_PROGRESS" ? (
          <button
            className="community-detail-button"
            disabled
          >
            진행중
          </button>
        ) : postDetail.progress === "COMPLETED" ? (
          <button
            className="community-detail-button"
            disabled
          >
            완료
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default CommunityDetail;
