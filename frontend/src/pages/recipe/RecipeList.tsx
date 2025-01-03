import { useRecipe } from "../../context/RecipeContext";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RecipeSearchBar from "../../components/recipe/RecipeSearchBar";
import "../../styles/recipe/RecipeList.css";

const RecipeList = () => {
  const { toggleBookmark, searchQuery, fetchRecipes } = useRecipe();
  const [displayedRecipes, setDisplayedRecipes] = useState<any[]>([]); // 타입을 any[]로 설정하여 오류 방지
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const PAGE_SIZE = 18;

  // 검색 및 북마크 필터링 포함 데이터 로드
  const fetchFilteredRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: 1,
        size: PAGE_SIZE,
        search: searchQuery.trim() || "",
      };
      if (searchQuery.trim()) params.search = searchQuery; // 검색어 반영

      const response = await fetchRecipes(params);
      console.log("Fetched response:", response); // 응답 확인
      let filtered = response?.content || []; // response.content가 undefined일 수 있음

      // 검색어에 따른 필터링
      if (searchQuery.trim()) {
        filtered = filtered.filter(
          (recipe) =>
            recipe.recipeTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            recipe.recipeFoodDetails
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // 북마크 필터 적용
      if (showBookmarksOnly) {
        filtered = filtered.filter((recipe) => recipe.recipeIsBookmarked);
      }

      if (searchQuery.trim() !== "") {
        filtered = filtered.filter(
          (recipe) =>
            recipe.recipeTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            recipe.recipeFoodDetails
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      console.log("Filtered recipes:", filtered); // 필터된 레시피 확인
      setDisplayedRecipes(filtered);
      setCurrentPage(1);
      setHasMore(filtered.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to fetch filtered recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRecipes, searchQuery, showBookmarksOnly]);

  useEffect(() => {
    fetchFilteredRecipes();
  }, [fetchFilteredRecipes]);

  // 무한 스크롤 데이터 로드
  const loadMoreRecipes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params = {
        page: currentPage + 1,
        size: PAGE_SIZE,
        search: searchQuery.trim() || undefined,
      };

      const response = await fetchRecipes(params);
      setDisplayedRecipes((prev) => [...prev, ...(response.content || [])]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(response.content.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load more recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, currentPage, fetchRecipes, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        loadMoreRecipes();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreRecipes]);

  // 북마크 클릭 핸들러 (즉시 반영)
  const handleBookmarkClick = async (recipeId: string) => {
    const updatedRecipes = displayedRecipes.map((recipe) =>
      recipe.recipeId === recipeId
        ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
        : recipe
    );

    // 북마크 필터 적용 중이면 필터링된 목록에서 제거
    const filteredRecipes = showBookmarksOnly
      ? updatedRecipes.filter((recipe) => recipe.recipeIsBookmarked)
      : updatedRecipes;

    setDisplayedRecipes(filteredRecipes);

    try {
      await toggleBookmark(recipeId);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      // 실패 시 상태 롤백
      setDisplayedRecipes((prev) =>
        prev.map((recipe) =>
          recipe.recipeId === recipeId
            ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
            : recipe
        )
      );
    }
  };
  // 레시피 데이터가 없는 경우 처리 (로딩 중이거나 데이터가 없음)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!displayedRecipes.length) {
    return <div>No recipes found</div>;
  }
  return (
    <>
      {/* 검색 바 */}
      <div className="recipe-list-searchbar-container">
        <RecipeSearchBar />
      </div>

      {/* 북마크 필터 */}
      <div className="recipe-list-option-container">
        <input
          type="checkbox"
          checked={showBookmarksOnly}
          onChange={(e) => setShowBookmarksOnly(e.target.checked)}
        />
        <label>북마크</label>
      </div>

      {/* 레시피 리스트 */}
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
                      recipe.userProfile || "/placeholder.jpg"
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
                  onClick={() => handleBookmarkClick(recipe.recipeId)}
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

      {/* 무한 스크롤 로드 버튼 */}
      {hasMore && !isLoading && (
        <div className="load-more-container">
          <button onClick={loadMoreRecipes}>Load More</button>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
    </>
  );
};

export default RecipeList;
