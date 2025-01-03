import React, { useState, useEffect } from "react";
import axios from "axios"; // axios import
import { useNavigate } from "react-router-dom";
import "../../styles/main/RecipeCarousel.css";

interface RecipeImages {
  id: string;
  name: string;
  img: string;
}
const apiUrl = import.meta.env.VITE_API_URL;

const RecipeCarousel: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeImages[]>([]); // 레시피 데이터를 상태로 관리
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const navigate = useNavigate(); // navigate 훅 사용

  useEffect(() => {
    // API에서 오늘의 레시피 데이터를 가져옵니다.
    const fetchTodaysRecipes = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/recipes/todays-recipe`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              userEmail: localStorage.getItem("userEmail"),
            },
          }
        );

        const recipeData = response.data;

        // 받아온 데이터를 carousel에 맞는 형식으로 변환
        const formattedData = recipeData.map((recipe: any) => ({
          id: recipe.recipeId, // recipeId 사용
          name: recipe.recipeTitle,
          img: recipe.recipeMainPhoto, // 서버에서 제공하는 이미지 URL을 사용
        }));

        setRecipes(formattedData); // 레시피 데이터 상태 업데이트
        setIsLoading(false); // 데이터 로딩이 완료되면 로딩 상태를 false로 설정
      } catch (error) {
        console.error("Failed to fetch today's recipes:", error);
        setIsLoading(false); // 로딩 실패 시에도 로딩 상태를 false로 설정
      }
    };

    fetchTodaysRecipes(); // 컴포넌트가 마운트될 때 API 호출
  }, []); // 빈 배열로 인해 한 번만 호출

  // 슬라이드 전환
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
      }, 3000); // 5초마다 자동 슬라이드

      return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 클리어
    }
  }, [recipes, isLoading]); // recipes가 변경될 때마다 인터벌을 새로 설정

  // 이전 슬라이드
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length
    );
  };

  // 다음 슬라이드
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  // 이미지 클릭 시 해당 레시피 디테일 페이지로 이동
  const handleImageClick = (recipeId: string) => {
    navigate(`/recipe/detail/${recipeId}`); // recipeId를 포함한 URL로 이동
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중이면 로딩 메시지를 표시
  }

  return (
    <div className="carousel-container">
      <div className="carousel-title">Today's Recipes</div>

      <div className="carousel-images">
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <img
            src={
              recipes[(currentIndex - 1 + recipes.length) % recipes.length]?.img
            }
            alt={
              recipes[(currentIndex - 1 + recipes.length) % recipes.length]
                ?.name
            }
            className="carousel-image-prev"
            loading="lazy" // Lazy loading 적용
            onClick={() =>
              handleImageClick(
                recipes[(currentIndex - 1 + recipes.length) % recipes.length].id
              )
            } // 이미지 클릭 시 이동
          />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={recipes[currentIndex]?.img}
            alt={recipes[currentIndex]?.name}
            className="carousel-image-current"
            loading="lazy" // Lazy loading 적용
            onClick={
              () => handleImageClick(recipes[currentIndex]?.id) // 이미지 클릭 시 이동
            }
          />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <img
            src={recipes[(currentIndex + 1) % recipes.length]?.img}
            alt={recipes[(currentIndex + 1) % recipes.length]?.name}
            className="carousel-image-next"
            loading="lazy" // Lazy loading 적용
            onClick={() =>
              handleImageClick(recipes[(currentIndex + 1) % recipes.length].id)
            } // 이미지 클릭 시 이동
          />
        </div>
      </div>

      <div className="carousel-navigation">
        <button
          className="carousel-button"
          onClick={prevSlide}
          disabled={isLoading}
        >
          &#10094;
        </button>
        <button
          className="carousel-button"
          onClick={nextSlide}
          disabled={isLoading}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default RecipeCarousel;
