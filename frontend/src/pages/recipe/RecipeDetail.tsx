import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecipe } from "../../context/RecipeContext";
import "../../styles/recipe/RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { recipes, setRecipes } = useRecipe(); // setRecipes 가져오기
  const navigate = useNavigate();
  const recipe = recipes[Number(id)];

  if (!recipe) {
    return <div className="recipe-detail-not-found">Recipe not found</div>;
  }

  const handleDelete = () => {
    const updatedRecipes = recipes.filter((_, index) => index !== Number(id));
    setRecipes(updatedRecipes); // 상태 업데이트
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes)); // 로컬스토리지 업데이트
    alert("Recipe has been deleted.");
    navigate("/recipe/list");
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
            {recipeSteps.photo && (
              <div className="recipe-detail-step-image">
                <img src={recipeSteps.photo} alt={`Step ${recipeSteps.seq}`} />
              </div>
            )}
            <div className="recipe-detail-step-description">
              {recipeSteps.description}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Button */}
      <div className="recipe-detail-delete-container">
        <button className="recipe-detail-delete-button" onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
