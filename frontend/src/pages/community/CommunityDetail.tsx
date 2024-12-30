import { useNavigate } from "react-router-dom"; // useNavigate 추가
import Swal from "sweetalert2"; // SweetAlert2 추가
import { useCommunity } from "../../context/CommunityContext";
import "../../styles/community/CommunityDetail.css";

const CommunityDetail = () => {
  const { communityData, setCommunityData } = useCommunity(); // 데이터와 설정 함수 가져오기
  const navigate = useNavigate();

  if (!communityData) {
    return <div>데이터가 없습니다. 다시 시도해주세요.</div>;
  }

  const {
    tradeType,
    postTitle,
    postContent,
    meetingPlace,
    meetingTime,
    postPhoto1,
    // postPhoto2,
    writerFoodId,
    proposerFoodListId,
  } = communityData;

  const handleEdit = () => {
    navigate("/community/edit"); // /community/edit 경로로 이동
  };

  const handleDelete = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제하면 데이터를 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 데이터 삭제 처리
        setCommunityData(null); // Context에서 데이터 초기화
        Swal.fire("삭제 완료", "데이터가 삭제되었습니다.", "success").then(
          () => {
            navigate("/community"); // 삭제 후 /community로 이동
          }
        );
      }
    });
  };

  return (
    <div className="community-detail-body">
      {/* 교환/나눔 표시 */}
      <div className="community-detail-category">
        [{tradeType === "EXCHANGE" ? "교환" : "나눔"}]
      </div>

      {/* 제목 표시 */}
      <div className="community-detail-title">{postTitle}</div>

      {/* 작성자 정보 */}
      <div className="community-detail-profile-container">
        <div className="community-detail-profile-container-profile"></div>
        <div className="community-detail-profile-container-name">test</div>
        <div className="community-detail-profile-container-time">
          {new Date(meetingTime).toLocaleString()}
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
        {postPhoto1 ? (
          <img src={postPhoto1} alt="첫 번째 이미지" />
        ) : (
          <p>첫 번째 이미지가 없습니다.</p>
        )}
        {/* {postPhoto2 ? (
          <img src={postPhoto2} alt="두 번째 이미지" />
        ) : (
          <p>두 번째 이미지가 없습니다.</p>
        )} */}
      </div>

      {/* 내용 표시 */}
      <div className="community-detail-box-container">
        <div className="community-detail-box-input">{postContent}</div>
      </div>

      {/* 만남 장소 표시 */}
      <div className="community-detail-box-container">
        <strong>만남 장소:</strong> {meetingPlace}
      </div>

      {/* 작성자/제안자 음식 ID 표시 */}
      <div className="community-detail-box-container">
        <strong>작성자의 재료 ID:</strong> {writerFoodId}
      </div>
      <div className="community-detail-box-container">
        <strong>교환 원하는 재료 ID:</strong> {proposerFoodListId}
      </div>

      {/* 요청 버튼 */}
      <div className="community-detail-button-container2">
        <button className="community-detail-button">요청하기</button>
      </div>
    </div>
  );
};

export default CommunityDetail;
