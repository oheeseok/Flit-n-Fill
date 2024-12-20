import React, { createContext, useContext, useState, useEffect } from "react";

// Recipe 데이터 인터페이스
interface RecipeMethod {
  seq: number;
  photo: string;
  description: string;
}

interface RecipeData {
  recipeTitle: string;
  recipeMainPhoto: string | null;
  recipeFoodDetails: string;
  recipeSteps: RecipeMethod[];
}

interface RecipeContextType {
  recipes: RecipeData[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeData[]>>;
  addRecipe: (recipe: RecipeData) => void;
  // 검색부분
  searchQuery: string; // 검색상태
  setSearchQuery: (query: string) => void; //검색 상태 업데이트 함수
}

// Context 기본 값
const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  setRecipes: () => {},
  addRecipe: () => {},
  searchQuery: "", //기본 검색 상태
  setSearchQuery: () => {},
});

// Provider 컴포넌트
export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<RecipeData[]>(() => {
    const storedRecipes = localStorage.getItem("recipes");
    return storedRecipes ? JSON.parse(storedRecipes) : [];
  });

  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색 상태 추가가

  const addRecipe = (recipe: RecipeData) => {
    setRecipes((prev) => {
      const updatedRecipes = [...prev, recipe];
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      return updatedRecipes;
    });

    // 새로 추가된 레시피의 인덱스를 반환
    return recipes.length;
  };

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  return (
    <RecipeContext.Provider
      value={{ recipes, setRecipes, addRecipe, searchQuery, setSearchQuery }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook 생성
export const useRecipe = () => useContext(RecipeContext);
