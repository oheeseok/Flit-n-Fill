import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../../styles/community/CommunityEdit.css";
import CommunityImageEdit from "../../components/community/CommunityImageEdit";

const CommunityEdit = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>()  // URL에서 postId 가져오기

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [postPhoto1, setPostPhoto1] = useState<File | null>(null);
  const [writerFoodId, setWriterFoodId] = useState(0);
  const [proposerFoodListId, setProposerFoodListId] = useState(0);

  // 기존 데이터 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`, {
          withCredentials: true,
        });
        const post = response.data;

        // 상태 업데이트
        setPostTitle(post.postTitle);
        setPostContent(post.postContent);
        setMeetingPlace(post.meetingPlace);
        setMeetingTime(post.meetingTime);
        setPostPhoto1(post.postPhoto1); 
        setWriterFoodId(post.writerFoodId);
        setProposerFoodListId(post.proposerFoodListId);
      } catch (error) {
        console.error("게시글 가져오기 실패:", error);
        Swal.fire("오류", "게시글 데이터를 가져오는 데 실패했습니다.", "error").then(
          () => {
            navigate("/community");
          }
        );
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, navigate]);

  const handlePhoto1Change = (image: File) => setPostPhoto1(image);

  const handleUpdate = async () => {
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

    try {
      const formData = new FormData();

      // JSON 데이터 생성
      const postUpdateDto = {
        postTitle,
        postContent,
        meetingPlace,
        meetingTime,
        writerFoodId,
        proposerFoodListId,
      };
      formData.append("postUpdateDto", JSON.stringify(postUpdateDto));

      // 이미지 추가
      if (postPhoto1) {
        formData.append("postMainPhoto", postPhoto1);
      }

      // 서버 요청
      const response = await axios.put(
        `/api/posts/${postId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "수정 완료",
          text: "게시물이 수정되었습니다!",
        }).then(() => {
          navigate(`/community/detail/${postId}`); // 수정 후 상세 페이지로 이동
        });
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      Swal.fire({
        icon: "error",
        title: "수정 실패",
        text: "게시물 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "info",
      title: "취소됨",
      text: "수정이 취소되었습니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate(`/community/detail/${postId}`);
    });
  };

  return (
    <div className="community-edit-body">
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
