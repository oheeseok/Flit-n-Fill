import { useRecipe } from "../../context/RecipeContext";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RecipeSearchBar from "../../components/recipe/RecipeSearchBar";
import "../../styles/recipe/RecipeList.css";

const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import { RecipeSimpleDto } from "../../context/RecipeContext";


const RecipeList = () => {
  const { toggleBookmark, searchQuery, fetchRecipes } = useRecipe();
  const [displayedRecipes, setDisplayedRecipes] = useState<any[]>([]); // 타입을 any[]로 설정하여 오류 방지
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQueryString, setSearchQueryString] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  // const [isMultuSearch, setIsMultiSearch] = useState(false);
  // const [recipes, setRecipes] = useState<RecipeSimpleDto[]>([]); // RecipeSimpleDto 타입의 배열


  const fetchMultiSearchRecipes = async (
    food1: string,
    food2: string,
    food3: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get<RecipeSimpleDto[]>(`${apiUrl}/api/recipes`, {
        params: { food1, food2, food3 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });
  
      console.log("Fetched multi-search recipes:", response.data);
  
      setDisplayedRecipes(response.data); // 다중 검색 결과를 displayedRecipes로 설정
    } catch (error) {
      console.error("Failed to fetch multi-search recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 다중 검색 파라미터 감지
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const food1 = urlParams.get("food1") || "";
    const food2 = urlParams.get("food2") || "";
    const food3 = urlParams.get("food3") || "";
  
    // 유효한 값이 없으면 함수 호출 중단
    if (!food1 && !food2 && !food3) {
      console.warn("No food parameters provided for multi-search.");
      return;
    }
  
    fetchMultiSearchRecipes(food1, food2, food3);
  }, [location.search]);
  

  const PAGE_SIZE = 18;

  // 검색 및 북마크 필터링 포함 데이터 로드
  const fetchFilteredRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        search: searchQuery.trim() || "", // 검색어 적용
      };
      setSearchQueryString(params.search);

      const response = await fetchRecipes(params);
      console.log("Fetched response:", response);

      // 검색 결과를 필터링 없이 적용

      setDisplayedRecipes(response?.content || response || []);
    } catch (error) {
      console.error("Failed to fetch filtered recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRecipes, searchQuery]);

  useEffect(() => {
    if (showBookmarksOnly) {
      setDisplayedRecipes((prev) =>
        prev.filter((recipe) => recipe.recipeIsBookmarked)
      );
    } else {
      fetchFilteredRecipes();
    }
  }, [showBookmarksOnly, fetchFilteredRecipes]);

  // 무한 스크롤 데이터 로드
  const loadMoreRecipes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      let additionalRecipes: any[] = [];

      // URL에서 food1, food2, food3 확인
      const urlParams = new URLSearchParams(window.location.search);
      const food1 = urlParams.get("food1");
      const food2 = urlParams.get("food2");
      const food3 = urlParams.get("food3");

      if (food1 || food2 || food3) {
        // 다중 검색 로직
        console.log("Loading more for multi-search");
        const response = await fetchMultiSearchRecipes(
          food1 || "",
          food2 || "",
          food3 || ""
        );

        if (Array.isArray(response)) {
          additionalRecipes = response;
        } else {
          console.error("Unexpected response for multi-search:", response);
        }
      } else {
        // 단일 검색 로직
        console.log("Loading more for single search");
        const params = {
          page: currentPage + 1,
          size: PAGE_SIZE,
          search: searchQuery.trim() || undefined,
        };

        const response = await fetchRecipes(params);

        if (response?.content) {
          additionalRecipes = showBookmarksOnly
            ? response.content.filter((recipe) => recipe.recipeIsBookmarked)
            : response.content;
          setHasMore(response.content.length === PAGE_SIZE);
        } else {
          console.error("Unexpected response for single search:", response);
        }
      }

      // 새로운 레시피 추가
      setDisplayedRecipes((prev) => [...prev, ...additionalRecipes]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load more recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    hasMore,
    currentPage,
    fetchRecipes,
    fetchMultiSearchRecipes,
    searchQuery,
    showBookmarksOnly,
  ]);

  useEffect(() => {
    let isFetching = false; // 데이터 로드 상태 플래그

    const handleScroll = () => {
      if (isFetching) return; // 이미 데이터 로드 중이면 실행하지 않음

      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;

      if (scrollPosition >= offsetHeight - 100) {
        if (
          !isLoading &&
          hasMore &&
          (!showBookmarksOnly || displayedRecipes.length >= PAGE_SIZE)
        ) {
          isFetching = true; // 플래그 설정
          const currentScrollY = window.scrollY;

          loadMoreRecipes().then(() => {
            setTimeout(() => {
              window.scrollTo(0, currentScrollY - 200);
            }, 0);
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    loadMoreRecipes,
    isLoading,
    hasMore,
    showBookmarksOnly,
    displayedRecipes.length,
  ]);

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

    if (showBookmarksOnly) {
      setHasMore(filteredRecipes.length >= PAGE_SIZE);
    }
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

  const handleButtonClick = async (searchQuery: string) => {
    const response = await axios.get(
      `${apiUrl}/api/recipes?search-query=${searchQuery}&src=youtube`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      }
    );

    const youtubeLink = response.data;
    console.log("youtubeLink: ", youtubeLink);
    window.open(youtubeLink, "_blank", "noopener,noreferrer");
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

      {searchQueryString !== "" && searchQueryString.length > 0 && (
        <button
          style={{ background: "#d4efc7" }}
          onClick={() => handleButtonClick(searchQueryString)}
        >
          더 많은 레시피 보러가기
        </button>
      )}

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
              {recipe.userNickname || "[탈퇴한 회원]"}의 {recipe.recipeTitle}
            </div>
            <div className="recipe-list-box-card">
              <div className="recipe-list-box-card-img-container">
                <Link to={`/recipe/detail/${recipe.recipeId}`}>
                  <img
                    className="recipe-list-box-card-img"
                    src={recipe.recipeMainPhoto || "/placeholder.jpg"}
                    alt={recipe.recipeTitle}
                  />
                </Link>
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
                  {recipe.userNickname || "탈퇴한 회원"}
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
    </>
  );
};

export default RecipeList;