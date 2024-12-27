import { useRecipe } from "../../context/RecipeContext";
import { Link, useSearchParams } from "react-router-dom";
import RecipeSearchBar from "../../components/recipe/RecipeSearchBar";
import "../../styles/recipe/RecipeList.css";
import { useState, useEffect } from "react";

const RecipeList = () => {
  const { recipes, toggleBookmark, searchQuery, fetchRecipes } = useRecipe();
  const [searchParams] = useSearchParams();
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");

  useEffect(() => {
    console.log("Search Query received in RecipeList:", searchQuery);

    const query = searchParams.get("query");
    if (query) {
      fetchRecipes({
        sort: sortOrder,
        search: query,
      });
    }
  }, [sortOrder, searchParams, searchQuery, fetchRecipes]);

  const filteredRecipes = recipes.filter(
    (recipe) => !showBookmarksOnly || recipe.isBookmarked
  );

  return (
    <>
      <div className="recipe-list-searchbar-container">
        <RecipeSearchBar />
      </div>
      <div className="recipe-list-option-container">
        <div className="recipe-list-option-bookmarked">
          <input
            type="checkbox"
            checked={showBookmarksOnly}
            onChange={(e) => setShowBookmarksOnly(e.target.checked)}
          />
          내 북마크
        </div>
        <div className="recipe-list-option-filter">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="popular">인기순</option>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>
      <div className="recipelistbody">
        {filteredRecipes.map((recipe, index) => (
          <div className="recipe-list-container" key={recipe.id}>
            <div className="recipe-list-box-name-title">
              {recipe.recipeTitle}
            </div>
            <div className="recipe-list-box-card">
              <div className="recipe-list-box-card-img-container">
                <img
                  className="recipe-list-box-card-img"
                  src={recipe.recipeMainPhoto || "/placeholder.jpg"}
                  alt={recipe.recipeTitle}
                />
              </div>
              <div className="recipe-list-box-card-profile-container">
                <div className="recipe-list-box-card-profile-container-img">
                  img
                </div>
                <div className="recipe-list-box-card-profile-container-name">
                  name
                </div>
                <div
                  className={`recipe-list-box-card-profile-container-star ${
                    recipe.isBookmarked ? "star-filled" : "star-empty"
                  }`}
                  onClick={() => toggleBookmark(index)}
                  style={{ cursor: "pointer" }}
                ></div>
              </div>
              <div className="recipe-list-box-card-title">
                {recipe.recipeTitle}
              </div>
              <div className="recipe-list-box-card-detail">
                {recipe.recipeFoodDetails}
              </div>
              <div className="recipe-list-box-card-more">
                <Link to={`/recipe/detail/${index}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecipeList;
