import { useNavigate, useParams } from "react-router-dom";
import { useRecipe } from "../../context/RecipeContext";
import "../../styles/recipe/RecipeDetail.css";
import Swal from "sweetalert2";
import Sampleimage from "../../assets/images/samplerecipe2.png";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { recipes, setRecipes } = useRecipe(); // setRecipes 가져오기
  const navigate = useNavigate();
  const recipe = recipes[Number(id)];

  if (!recipe) {
    return <div className="recipe-detail-not-found">Recipe not found</div>;
  }

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
        const updatedRecipes = recipes.filter(
          (_, index) => index !== Number(id)
        );
        setRecipes(updatedRecipes); // 상태 업데이트
        localStorage.setItem("recipes", JSON.stringify(updatedRecipes)); // 로컬스토리지 업데이트

        Swal.fire({
          title: "삭제 완료",
          text: "레시피가 성공적으로 삭제되었습니다.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        }).then(() => {
          navigate("/recipe/list");
        });
      }
    });
  };

  const handleEdit = () => {
    navigate(`/recipe/edit/${id}`);
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
        {recipe.recipeSteps.map((recipeSteps) => (
          <div key={recipeSteps.seq} className="recipe-detail-step-box">
            <div className="recipe-detail-step-num">Step {recipeSteps.seq}</div>

            <div className="recipe-detail-step-image">
              <img
                src={recipeSteps.photo || Sampleimage}
                alt={`Step ${recipeSteps.seq}`}
              />
            </div>

            <div className="recipe-detail-step-description">
              {recipeSteps.description}
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
