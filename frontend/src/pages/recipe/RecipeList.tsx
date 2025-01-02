import { useRecipe } from "../../context/RecipeContext";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RecipeSearchBar from "../../components/recipe/RecipeSearchBar";
import "../../styles/recipe/RecipeList.css";
import { RecipeSimpleDto } from "../../context/RecipeContext";

const RecipeList = () => {
  const { recipes, toggleBookmark, searchQuery, fetchRecipes } = useRecipe(); // searchQuery 추가
  const [displayedRecipes, setDisplayedRecipes] = useState<RecipeSimpleDto[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const PAGE_SIZE = 30;

  // 북마크 필터링된 데이터 가져오기
  const getFilteredRecipes = useCallback(() => {
    let filtered = showBookmarksOnly
      ? recipes.filter((recipe) => recipe.recipeIsBookmarked)
      : recipes;

    // 여러 개의 검색어로 필터링 (각 검색어가 모두 포함된 데이터만 필터링)
    if (searchQuery.trim() !== "") {
      const searchTerms = searchQuery.trim().toLowerCase().split(" "); // 공백 기준으로 검색어 나누기

      filtered = filtered.filter((recipe) =>
        searchTerms.every(
          (term) => recipe.recipeFoodDetails.toLowerCase().includes(term) // 모든 단어가 포함된 경우만 필터링
        )
      );
    }

    return filtered;
  }, [recipes, showBookmarksOnly, searchQuery]);

  // 데이터 로드 함수
  const loadMoreRecipes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const filteredRecipes = getFilteredRecipes();
      const startIndex = currentPage * PAGE_SIZE;
      const newRecipes = filteredRecipes.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );

      if (newRecipes.length > 0) {
        const uniqueRecipes = [
          ...displayedRecipes,
          ...newRecipes.filter(
            (newRecipe) =>
              !displayedRecipes.some(
                (existingRecipe) =>
                  existingRecipe.recipeId === newRecipe.recipeId
              )
          ),
        ];
        setDisplayedRecipes(uniqueRecipes);
        setCurrentPage((prev) => prev + 1);
      }

      if (newRecipes.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, currentPage, getFilteredRecipes, displayedRecipes]);

  // 초기 데이터 로드
  useEffect(() => {
    const initializeRecipes = async () => {
      setIsLoading(true);
      try {
        await fetchRecipes(); // 서버에서 데이터를 가져옴
        const filteredRecipes = getFilteredRecipes();
        setDisplayedRecipes(filteredRecipes.slice(0, PAGE_SIZE));
        setCurrentPage(2);
        setHasMore(filteredRecipes.length > PAGE_SIZE);
      } catch (error) {
        console.error("Failed to initialize recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRecipes();
  }, [fetchRecipes, getFilteredRecipes]);

  // 북마크 보기 상태 변경 시 데이터 초기화
  useEffect(() => {
    const filteredRecipes = getFilteredRecipes();
    setDisplayedRecipes(filteredRecipes.slice(0, PAGE_SIZE)); // 필터링된 데이터를 한번에 설정
    setCurrentPage(2);
    setHasMore(filteredRecipes.length > PAGE_SIZE);
  }, [getFilteredRecipes, showBookmarksOnly, searchQuery]);

  // 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      loadMoreRecipes();
    }
  }, [loadMoreRecipes]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <div className="recipe-list-searchbar-container">
        <RecipeSearchBar />
      </div>
      <div className="recipe-list-option-container">
        <div>
          <input
            type="checkbox"
            checked={showBookmarksOnly}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setShowBookmarksOnly(isChecked);
              // 북마크 보기 상태 변경 시, 데이터를 한 번만 업데이트
              const filteredRecipes = getFilteredRecipes();
              setDisplayedRecipes(filteredRecipes.slice(0, PAGE_SIZE));
              setCurrentPage(2);
              setHasMore(filteredRecipes.length > PAGE_SIZE);
            }}
          />
          <label>북마크</label>
        </div>
      </div>
      <div className="recipelistbody">
        {displayedRecipes.map((recipe) => (
          <div className="recipe-list-container" key={recipe.recipeId}>
            <div className="recipe-list-box-name-title">
              {recipe.userNickname}의 {recipe.recipeTitle}
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
                <div
                  className="recipe-list-box-card-profile-container-img"
                  style={{
                    backgroundImage: `url(${
                      recipe.userProfile || "https://placeholder.url"
                    })`,
                    backgroundSize: "cover",
                    borderRadius: "36px",
                    width: "42px",
                    height: "42px",
                  }}
                ></div>
                <div className="recipe-list-box-card-profile-container-name">
                  {recipe.userNickname || "Unknown User"}
                </div>
                <div
                  className={`recipe-list-box-card-profile-container-star ${
                    recipe.recipeIsBookmarked ? "star-filled" : "star-empty"
                  }`}
                  onClick={() => toggleBookmark(recipe.recipeId)}
                  style={{ cursor: "pointer" }}
                ></div>
              </div>
              <div className="recipe-list-box-card-title">
                {recipe.recipeTitle}
              </div>
              <div className="recipe-list-box-card-detail">
                {recipe.recipeFoodDetails.slice(0, 30)}...
              </div>
              <div className="recipe-list-box-card-more">
                <Link to={`/recipe/detail/${recipe.recipeId}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecipeList;
