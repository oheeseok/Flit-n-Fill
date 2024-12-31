import { React, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecipe } from "../../context/RecipeContext";
import "../../styles/recipe/RecipeDetail.css";
import Swal from "sweetalert2";
import Sampleimage from "../../assets/images/samplerecipemethod.jpg";

const RecipeDetail = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const { getRecipeDetail } = useRecipe(); // 훅에서 getRecipeDetail을 구조 분해 할당
  const [recipe, setRecipe] = useState<RecipeDetailDto | null>(null);
  const { recipes, setRecipes } = useRecipe(); // setRecipes 가져오기
  const navigate = useNavigate();

  // const recipe = recipes.find((recipe) => recipe.recipeId === recipeId);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeDetail = await getRecipeDetail(recipeId); // 비동기 호출
        setRecipe(recipeDetail); // 레시피 정보를 상태에 저장
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipe(); // useEffect 내에서 비동기 함수 호출
  }, [getRecipeDetail]); // getRecipeDetail 함수가 변경될 때마다 실행

  if (!recipe) {
    console.log("recipe not found");
    return <div className="recipe-detail-not-found">Recipe not found</div>;
  } else {
    console.log("recipe found: ", recipe);
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
        console.log(">>>> 삭제됐다고 치자");
        // const updatedRecipes = recipes.filter(
        //   (_, index) => index !== Number(id)
        // );
        // setRecipes(updatedRecipes); // 상태 업데이트
        // localStorage.setItem("recipes", JSON.stringify(updatedRecipes)); // 로컬스토리지 업데이트

        // Swal.fire({
        //   title: "삭제 완료",
        //   text: "레시피가 성공적으로 삭제되었습니다.",
        //   icon: "success",
        //   confirmButtonColor: "#3085d6",
        //   confirmButtonText: "확인",
        // }).then(() => {
        //   navigate("/recipe/list");
        // });
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
