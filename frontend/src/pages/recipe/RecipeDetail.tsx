import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useRecipe } from "../../context/RecipeContext";
import "../../styles/recipe/RecipeDetail.css";
import Swal from "sweetalert2";
import axios from "axios";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any | null>(null); // 레시피 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 관리

  // 레시피 상세 정보 API 호출
  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        setRecipe(response.data); // 레시피 데이터 설정
        setIsLoading(false); // 로딩 완료
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setIsLoading(false); // 오류 발생 시 로딩 완료
      }
    };

    fetchRecipeDetail(); // 컴포넌트가 마운트될 때 API 호출
  }, [id]);

  // 로딩 중이라면 로딩 메시지 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 레시피가 없다면 에러 메시지 표시
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
          .delete(`/api/recipes/${id}`)
          .then(() => {
            Swal.fire({
              title: "삭제 완료",
              text: "레시피가 성공적으로 삭제되었습니다.",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "확인",
            }).then(() => {
              navigate("/recipe/list"); // 삭제 후 리스트 페이지로 이동
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

  // 레시피 수정 처리
  const handleEdit = () => {
    navigate(`/recipe/edit/${id}`); // 수정 페이지로 이동
  };

  return (
    <div className="recipe-detail-body">
      {/* Recipe Title Section */}
      <div className="recipe-detail-title-container">
        <div className="recipe-detail-title">{recipe.recipeTitle}</div>
        {recipe.recipeMainPhoto && (
          <div className="recipe-detail-image">
            <img src={recipe.recipeMainPhoto} alt={recipe.recipeTitle} />
          </div>
        )}
      </div>

      {/* Ingredients Section */}
      <div className="recipe-detail-ingredients-container">
        <div className="recipe-detail-ingredients-title">Ingredients</div>
        <div className="recipe-detail-ingredients-text">
          {recipe.recipeFoodDetails}
        </div>
      </div>

      {/* Recipe Steps Section */}
      <div className="recipe-detail-steps-container">
        <div className="recipe-detail-steps-title">Recipe Steps</div>
        {recipe.recipeSteps.map((step: any) => (
          <div key={step.seq} className="recipe-detail-step-box">
            <div className="recipe-detail-step-num">Step {step.seq}</div>

            <div className="recipe-detail-step-image">
              <img
                src={step.photo} 
                alt={`Step ${step.seq}`}
              />
            </div>

            <div className="recipe-detail-step-description">
              {step.description}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="recipe-detail-action-container">
        <button
          className="recipe-detail-edit-button"
          onClick={handleEdit}
          style={{ marginRight: "20px" }}
        >
          수정하기
        </button>
        <button className="recipe-detail-delete-button" onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
