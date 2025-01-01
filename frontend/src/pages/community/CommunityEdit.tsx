import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCommunity } from "../../context/CommunityContext";
import "../../styles/community/CommunityEdit.css";
import CommunityImageEdit from "../../components/community/CommunityImageEdit";

const CommunityEdit = () => {
  const { communityData, setCommunityData } = useCommunity();
  const navigate = useNavigate();

  // 상태 관리
  const [postTitle, setPostTitle] = useState(communityData?.postTitle || "");
  const [postContent, setPostContent] = useState(
    communityData?.postContent || ""
  );
  const [meetingPlace, setMeetingPlace] = useState(
    communityData?.meetingPlace || ""
  );
  const [meetingTime, setMeetingTime] = useState(
    communityData?.meetingTime || ""
  );
  const [postPhoto1, setPostPhoto1] = useState<string | null>(
    communityData?.postPhoto1 || null
  );
  const [
    postPhoto2,
    // setPostPhoto2
  ] = useState<string | null>(communityData?.postPhoto2 || null);
  const [tradeType, setTradeType] = useState(
    communityData?.tradeType || "EXCHANGE"
  );
  const [writerFoodId, setWriterFoodId] = useState(
    communityData?.writerFoodId || 0
  );
  const [proposerFoodListId, setProposerFoodListId] = useState(
    communityData?.proposerFoodListId || 0
  );

  const handlePhoto1Change = (image: string) => setPostPhoto1(image);
  // const handlePhoto2Change = (image: string) => setPostPhoto2(image);

  const handleUpdate = () => {
    if (
      !postTitle.trim() ||
      !postContent.trim() ||
      !meetingPlace.trim() ||
      !meetingTime.trim() ||
      !postPhoto1
    ) {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "모든 필드를 입력해주세요.",
      });
      return;
    }

    // 업데이트된 데이터 생성
    const updatedData = {
      postTitle,
      postContent,
      meetingPlace,
      meetingTime,
      postPhoto1,
      postPhoto2,
      tradeType,
      writerFoodId,
      proposerFoodListId,
    };

    setCommunityData(updatedData); // Context 데이터 업데이트

    Swal.fire({
      icon: "success",
      title: "수정 완료",
      text: "게시물이 수정되었습니다!",
    }).then(() => {
      navigate("/community/detail"); // 수정 후 상세 페이지로 이동
    });
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "info",
      title: "취소됨",
      text: "수정이 취소되었습니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate("/community/detail");
    });
  };

  return (
    <div className="community-edit-body">
      {/* 교환/나눔 선택 */}
      <div className="community-edit-category">
        <label>
          <input
            type="radio"
            name="category"
            value="EXCHANGE"
            checked={tradeType === "EXCHANGE"}
            onChange={(e) => setTradeType(e.target.value)}
          />
          교환
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="SHARE"
            checked={tradeType === "SHARE"}
            onChange={(e) => setTradeType(e.target.value)}
          />
          나눔
        </label>
      </div>
      {/* 제목 입력 */}
      <input
        type="text"
        className="community-edit-title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      {/* 이미지 업로더 */}
      <div className="community-edit-img">
        <CommunityImageEdit
          onChangeImage={handlePhoto1Change}
          uploadedImage={postPhoto1}
        />
      </div>
      {/* 장소 입력 */}
      <input
        type="text"
        className="community-edit-text"
        value={meetingPlace}
        onChange={(e) => setMeetingPlace(e.target.value)}
        placeholder="만남 장소를 입력하세요"
      />
      {/* 시간 입력 */}
      <input
        type="datetime-local"
        className="community-edit-text"
        value={meetingTime}
        onChange={(e) => setMeetingTime(e.target.value)}
        placeholder="만남 시간을 입력하세요"
      />
      {/* 작성자/제안자 음식 ID 입력 */}
      작성자의 재료
      <input
        type="number"
        className="community-edit-text"
        value={writerFoodId}
        onChange={(e) => setWriterFoodId(Number(e.target.value))}
      />
      교환 원하는 재료
      <input
        type="number"
        className="community-edit-text"
        value={proposerFoodListId}
        onChange={(e) => setProposerFoodListId(Number(e.target.value))}
      />
      {/* 내용 입력 */}
      <textarea
        className="community-edit-box-input"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="내용을 입력하세요"
      />
      {/* 버튼 */}
      <div className="community-edit-button-container">
        <button
          className="community-edit-register-button"
          onClick={handleUpdate}
        >
          수정
        </button>
        <button className="community-edit-cancel-button" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default CommunityEdit;
