import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/recipe/NearExpirationRecipe.css";

const apiUrl = import.meta.env.VITE_API_URL;

const fetchNearExpiryRecipes = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/recipes/near-expiry`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        userEmail: localStorage.getItem("userEmail"),
      },
    });

    return response.data.slice(0, 8); // 최대 8개의 레시피만 반환
  } catch (error) {
    return [];
  }
};

const NearExpirationRecipe: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await fetchNearExpiryRecipes();
      setRecipes(data); // 최대 8개로 제한된 데이터 설정
    };

    fetchRecipes();
  }, []);

  // 자동 슬라이드 설정
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
    }, 4500); // 4초마다 다음 슬라이드

    // 컴포넌트 언마운트 시 clearInterval 호출
    return () => clearInterval(interval);
  }, [recipes.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length
    );
  };

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/detail/${recipeId}`);
  };

  if (recipes.length === 0) {
    return <div>유통기한 임박 재료가 없습니다.</div>;
  }

  const prevIndex = (currentIndex - 1 + recipes.length) % recipes.length;
  const nextIndex = (currentIndex + 1) % recipes.length;
  const next2Index = (currentIndex + 2) % recipes.length;

  return (
    <div className="near-expiration-container">
      <div className="near-expiration-title">Near-Expiration-Recipes</div>

      <div className="near-expiration-images">
        <img
          src={recipes[prevIndex]?.recipeMainPhoto}
          alt={recipes[prevIndex]?.recipeTitle}
          onClick={() => handleRecipeClick(recipes[prevIndex]?.recipeId)}
          style={{ cursor: "pointer" }}
        />
        <img
          src={recipes[currentIndex]?.recipeMainPhoto}
          alt={recipes[currentIndex]?.recipeTitle}
          onClick={() => handleRecipeClick(recipes[currentIndex]?.recipeId)}
          style={{ cursor: "pointer" }}
        />
        <img
          src={recipes[nextIndex]?.recipeMainPhoto}
          alt={recipes[nextIndex]?.recipeTitle}
          onClick={() => handleRecipeClick(recipes[nextIndex]?.recipeId)}
          style={{ cursor: "pointer" }}
        />
        <img
          src={recipes[next2Index]?.recipeMainPhoto}
          alt={recipes[next2Index]?.recipeTitle}
          onClick={() => handleRecipeClick(recipes[next2Index]?.recipeId)}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="near-expiration-buttons">
        <button
          className="near-expiration-buttons-carousel"
          onClick={prevSlide}
        >
          &#10094;
        </button>
        <button
          className="near-expiration-buttons-carousel"
          onClick={nextSlide}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default NearExpirationRecipe;
