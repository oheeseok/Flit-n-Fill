import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import CommunityImageUploader from "../../components/community/CommunityImageUploader";
import "../../styles/community/CommunityRegister.css";

interface FoodDetailDto {
  foodId: number;
  foodListName: string;
  foodRegistDate: string;
  foodCount: number;
  foodUnit: string;
  foodProDate: string;
  foodExpDate: string;
  foodStorage: string;
  foodIsThaw: boolean;
  foodDescription: string;
  foodListIcon: string;
  foodListId: number;
}

interface FoodListViewDto {
  foodListId: number;
  foodListGroup: string;
  foodListType: string;
  foodListProduct: string;
  foodListIcon: number;
}

interface  LocationState {
  bucketItemId: number;
}

const CommunityRegister = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { bucketItemId } = location.state as LocationState;

  // 상태 관리
  const [uploadedImage1, setUploadedImage1] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [meetingPlace, setMeetingPlace] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [category, setCategory] = useState<string>("EXCHANGE");
  const [writerFoodId, setWriterFoodId] = useState<number>(bucketItemId || 0);
  const [proposerFoodListId, setProposerFoodListId] = useState<number>(0);
  const [fridgeItems, setFridgeItems] = useState<FoodDetailDto[]>([])
  const [foodList, setFoodList] = useState<FoodListViewDto[]>([])

  console.log(writerFoodId);
  // 이미지 업로드 핸들러
  const handleImage1Change = (image: File) => setUploadedImage1(image);

  // 음식 리스트 가져오기
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get<FoodListViewDto[]>(
          `${apiUrl}/api/foodlist`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              userEmail: localStorage.getItem("userEmail"),
            },
          }
        );
        console.log("foodList: ", response.data)
        setFoodList(response.data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error("음식 리스트를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchFoodList();
  }, []);

  // 작성자의 재료 목록 가져오기
  useEffect(() => {
    const fetchFridgeItems = async () => {
      try {
        const response = await axios.get<FoodDetailDto[]>(`${apiUrl}/api/my-fridge`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        });
        const uniqueItems = Array.from(
          new Map(response.data.map((item) => [item.foodListName, item])).values()
        );

        console.log("fridge items: ", response.data)
        setFridgeItems(uniqueItems);
      } catch (error) {
        console.error("작성자의 재료를 가져오는 데 실패했습니다:", error);
        Swal.fire("오류", "작성자의 재료를 가져오는 데 실패했습니다.", "error");
      }
    };

    fetchFridgeItems();
  }, []);

  const handleRegister = async () => {
    // 필수 입력값 확인
    if (
      !title.trim() ||
      !content.trim() ||
      !meetingPlace.trim() ||
      !meetingTime.trim() ||
      !uploadedImage1
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
      const communityPost = {
        postTitle: title,
        postContent: content,
        meetingPlace,
        meetingTime,
        tradeType: category,
        writerFoodId,
        proposerFoodListId,
      };
      formData.append("postRegisterDto", JSON.stringify(communityPost))
      formData.append("postMainPhoto", uploadedImage1)

      console.log("formData: ", formData)

      const response = await axios.post(
        "/api/posts",
        formData,
        {
          withCredentials: true,
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"), 
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "등록 성공",
          text: "게시물이 성공적으로 등록되었습니다!",
        }).then(() => {
          navigate("/community");
        });
      }

    } catch (error) {
      console.error("게시글 등록 실패:", error);
      Swal.fire({
        icon: "error",
        title: "등록 실패",
        text: "게시물 등록 중 오류가 발생했습니다.",
      });
    }
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
            value="SHARING"
            checked={category === "SHARING"}
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
      나의 재료
      <select
        className="community-register-text"
        value={writerFoodId}
        onChange={(e) => setWriterFoodId(Number(e.target.value))}
      >
        <option value="">재료를 선택하세요</option>
        {fridgeItems.map((item) => (
          <option key={item.foodId} value={item.foodId}>
            {item.foodListName}
          </option>
        ))}
      </select>
      { category !== "SHARING" && (
        <div>
          원하는 재료
          <select
            className="community-register-text"
            value={proposerFoodListId}
            onChange={(e) => setProposerFoodListId(Number(e.target.value))}
          >
            <option value="">재료를 선택하세요</option>
            {foodList.map((food) => (
              <option key={food.foodListId} value={food.foodListId}>
                {food.foodListProduct !== null ? food.foodListProduct : food.foodListType}
              </option>
            ))}
          </select>
        </div>
      )}
      
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
          className="community-register-cancel-button"
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          className="community-register-register-button"
          onClick={handleRegister}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommunityRegister;
