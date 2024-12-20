import SearchBar from "../../components/common/SearchBar";
import NearExpirationRecipe from "../../components/recipe/NearExpirationRecipe";
import RecipeCarousel from "../../components/main/RecipeCarousel";
import RecipeResisterButton from "../../components/recipe/RecipeResisterButton";
import "../../styles/recipe/Recipe.css";

const Recipe = () => {
  return (
    <>
      <div className="recipebody">
        <SearchBar></SearchBar>
        <RecipeResisterButton></RecipeResisterButton>
        <div className="recipe-container">
          <div className="near-expiration-recipe">
            <NearExpirationRecipe />
          </div>
          <div className="recipe-text"></div>
          <RecipeCarousel></RecipeCarousel>
        </div>
      </div>
    </>
  );
};
export default Recipe;
