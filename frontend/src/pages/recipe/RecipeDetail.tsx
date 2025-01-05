import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/recipe/RecipeDetail.css";
import Swal from "sweetalert2";
import axios from "axios";

const RecipeDetail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any | null>(null); // 레시피 상태 관리
  const [userNickname, setUserNickname] = useState<string | null>(null); // 로그인 사용자 닉네임
  const [isOwner, setIsOwner] = useState<boolean>(false); // 소유 여부
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 관리

  // 현재 로그인한 사용자 정보 가져오기
  const fetchUserNickname = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });
      return response.data.userNickname; // 사용자 닉네임 반환
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
      return null;
    }
  };
  console.log(userNickname);
  // 레시피 상세 정보 및 사용자 닉네임 비교
  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        setIsLoading(true);

        // 사용자 닉네임 가져오기
        const loggedInNickname = await fetchUserNickname();
        setUserNickname(loggedInNickname);

        // 레시피 정보 가져오기
        const response = await axios.get(`${apiUrl}/api/recipes/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        });

        const recipeData = response.data;
        setRecipe(recipeData);

        // 닉네임 비교하여 소유 여부 판단
        if (loggedInNickname && recipeData.userNickname === loggedInNickname) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }

        console.log("Logged-in user:", loggedInNickname);
        console.log("Fetched recipe:", recipeData);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        Swal.fire({
          icon: "error",
          title: "레시피를 불러오는데 실패했습니다.",
          confirmButtonText: "확인",
        });
        navigate("/recipe/list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [id]); // `id`가 변경될 때만 실행

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div className="recipe-detail-not-found">Recipe not found</div>;
  }

  // 레시피 삭제 처리
  const handleDelete = () => {
    Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f34662",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiUrl}/api/recipes/${id}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              userEmail: localStorage.getItem("userEmail"),
            },
          })
          .then(() => {
            Swal.fire({
              title: "삭제 완료",
              text: "레시피가 성공적으로 삭제되었습니다.",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "확인",
            }).then(() => {
              navigate("/recipe/list");
            });
          })
          .catch((error) => {
            console.error("Failed to delete recipe:", error);
            Swal.fire({
              title: "삭제 실패",
              text: "레시피 삭제에 실패했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          });
      }
    });
  };

  const handleEdit = () => {
    navigate(`/recipe/edit/${id}`);
  };

  return (
    <div className="recipe-detail-body">
      <div className="recipe-detail-title-container">
        <div className="recipe-detail-title">{recipe.recipeTitle}</div>
        {recipe.recipeMainPhoto && (
          <div className="recipe-detail-image">
            <img src={recipe.recipeMainPhoto} alt={recipe.recipeTitle} />
          </div>
        )}
      </div>

      <div className="recipe-detail-ingredients-container">
        <div className="recipe-detail-ingredients-title">Ingredients</div>
        <div className="recipe-detail-ingredients-text">
          {recipe.recipeFoodDetails}
        </div>
      </div>

      <div className="recipe-detail-steps-container">
        <div className="recipe-detail-steps-title">Recipe Steps</div>
        {recipe.recipeSteps.map((step: any) => (
          <div key={step.seq} className="recipe-detail-step-box">
            <div className="recipe-detail-step-num">Step {step.seq}</div>
            <div className="recipe-detail-step-image">
              <img src={step.photo} alt={`Step ${step.seq}`} />
            </div>
            <div className="recipe-detail-step-description">
              {step.description}
            </div>
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="recipe-detail-action-container">
          <button
            className="recipe-detail-edit-button"
            onClick={handleEdit}
            style={{ marginRight: "20px" }}
          >
            수정하기
          </button>
          <button
            className="recipe-detail-delete-button"
            onClick={handleDelete}
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
