import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCommunity } from "../../context/CommunityContext";
import CommunityImageUploader from "../../components/community/CommunityImageUploader";
import "../../styles/community/CommunityRegister.css";

const CommunityRegister = () => {
  const navigate = useNavigate();
  const { setCommunityData } = useCommunity(); // Context의 데이터 설정 함수 사용

  // 상태 관리
  const [uploadedImage1, setUploadedImage1] = useState<string | null>(null);
  const [uploadedImage2, setUploadedImage2] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [meetingPlace, setMeetingPlace] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [category, setCategory] = useState<string>("EXCHANGE");
  const [writerFoodId, setWriterFoodId] = useState<number>(0);
  const [proposerFoodListId, setProposerFoodListId] = useState<number>(0);

  // 이미지 업로드 핸들러
  const handleImage1Change = (image: string) => setUploadedImage1(image);
  // const handleImage2Change = (image: string) => setUploadedImage2(image);

  const handleRegister = () => {
    // 필수 입력값 확인
    if (
      !title.trim() ||
      !content.trim() ||
      !meetingPlace.trim() ||
      !meetingTime.trim() ||
      !uploadedImage1
      // ||
      // !uploadedImage2
    ) {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "모든 필드를 입력해주세요.",
      });
      return;
    }

    // JSON 데이터 생성
    const communityPost = {
      postTitle: title,
      postContent: content,
      meetingPlace,
      meetingTime,
      postPhoto1: uploadedImage1,
      postPhoto2: uploadedImage2,
      tradeType: category,
      writerFoodId,
      proposerFoodListId,
    };

    console.log("등록 데이터:", communityPost);

    // Context에 데이터 저장
    setCommunityData(communityPost);

    Swal.fire({
      icon: "success",
      title: "등록 성공",
      text: "게시물이 성공적으로 등록되었습니다!",
    }).then(() => {
      navigate("/community/detail");
    });
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "info",
      title: "취소됨",
      text: "입력이 취소되었습니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate("/community");
    });
  };

  return (
    <div className="community-register-body">
      {/* 교환/나눔 선택 */}
      <div className="community-register-category">
        <label>
          <input
            type="radio"
            name="category"
            value="EXCHANGE"
            checked={category === "EXCHANGE"}
            onChange={(e) => setCategory(e.target.value)}
          />
          교환
        </label>
        <label>
          <input
            type="radio"
            name="category"
            value="SHARE"
            checked={category === "SHARE"}
            onChange={(e) => setCategory(e.target.value)}
          />
          나눔
        </label>
      </div>
      {/* 제목 입력 */}
      <input
        type="text"
        className="community-register-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
      {/* 이미지 업로더 */}
      <div className="community-register-img">
        <CommunityImageUploader
          onChangeImage={handleImage1Change}
          uploadedImage={uploadedImage1}
        />
      </div>
      {/* 장소 입력 */}
      <input
        type="text"
        className="community-register-text"
        value={meetingPlace}
        onChange={(e) => setMeetingPlace(e.target.value)}
        placeholder="만남 장소를 입력하세요"
      />
      {/* 시간 입력 */}
      <input
        type="datetime-local"
        className="community-register-text"
        value={meetingTime}
        onChange={(e) => setMeetingTime(e.target.value)}
        placeholder="만남 시간을 입력하세요"
      />
      {/* 작성자/제안자 음식 ID */}
      작성자의 재료
      <input
        type="number"
        className="community-register-text"
        value={writerFoodId}
        onChange={(e) => setWriterFoodId(Number(e.target.value))}
        placeholder="작성자 음식 ID를 입력하세요"
      />
      교환원하는 재료
      <input
        type="number"
        className="community-register-text"
        value={proposerFoodListId}
        onChange={(e) => setProposerFoodListId(Number(e.target.value))}
        placeholder="제안자 음식 리스트 ID를 입력하세요"
      />
      {/* 내용 입력 */}
      <textarea
        className="community-register-box-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
      />
      {/* 등록/취소 버튼 */}
      <div className="community-register-button-container">
        <button
          className="community-register-register-button"
          onClick={handleRegister}
        >
          등록
        </button>
        <button
          className="community-register-cancel-button"
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default CommunityRegister;
