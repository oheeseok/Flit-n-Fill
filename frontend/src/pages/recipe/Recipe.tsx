import RecipeSearchBar from "../../components/recipe/RecipeSearchBar";
import NearExpirationRecipe from "../../components/recipe/NearExpirationRecipe";
import RecipeCarousel from "../../components/main/RecipeCarousel";
import RecipeRegisterButton from "../../components/recipe/RecipeRegisterButton";
import "../../styles/recipe/Recipe.css";

const Recipe = () => {
  return (
    <>
      <div className="recipebody">
        <RecipeSearchBar></RecipeSearchBar>
        <RecipeRegisterButton></RecipeRegisterButton>
        <div className="recipe-container">
          <div className="near-expiration-recipe">
            <NearExpirationRecipe />
          </div>
          <div className="recipe-text">
            <RecipeCarousel></RecipeCarousel>
          </div>
        </div>
      </div>
    </>
  );
};
export default Recipe;
