import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Recipe 데이터 인터페이스
export interface RecipePageResponse {
  content: RecipeSimpleDto[]; // 레시피 목록
  totalPages: number; // 전체 페이지 수
}

export interface RecipeSimpleDto {
  recipeId: string;
  recipeTitle: string;
  recipeMainPhoto: string;
  recipeFoodDetails: string;
  recipeIsVisibility: boolean;
  recipeIsBookmarked: boolean;
  recipeCreatedDate: Date;
  userNickname: string;
  userProfile: string;
}

interface RecipeStepDto {
  seq: number;
  photo: string; // 각 단계별 사진 URL
  description: string; // 각 단계의 설명
}

interface RecipeRegisterDto {
  recipeTitle: string;
  recipeMainPhoto: string;
  recipeFoodDetails: string;
  recipeSteps: RecipeStepDto[]; // 각 단계의 photo 포함
  recipeIsVisibility: boolean;
}

interface RecipeDetailDto {
  recipeId: string;
  recipeTitle: string;
  recipeMainPhoto: string;
  recipeFoodDetails: string;
  recipeSteps: RecipeStepDto[];
  recipeIsVisibility: boolean;
  recipeIsBookmarked: boolean;
  recipeCreatedDate: Date;
  userNickname: string;
  userProfile: string;
}

interface RecipeContextType {
  recipes: RecipeSimpleDto[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeSimpleDto[]>>;
  addRecipe: (
    recipe: RecipeRegisterDto & {
      recipeMainPhoto: string;
      recipeStepPhotos: string[];
    }
  ) => Promise<RecipeDetailDto>;
  toggleBookmark: (recipeId: string) => Promise<void>;
  fetchRecipes: (params?: {
    search?: string;
    src?: string;
    page?: number;
    size?: number;
  }) => Promise<RecipePageResponse>;
  fetchMultiSearchRecipes: (params?: {
    food1?: string;
    food2?: string;
    food3?: string;
  }) => Promise<RecipeSimpleDto[]>; // 다중 검색 함수 추가
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchRecipes: () => Promise<void>;
  getRecipeDetail: (recipeId: string) => Promise<RecipeDetailDto>;
}

const apiUrl = import.meta.env.VITE_API_URL;

const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  setRecipes: () => {},
  addRecipe: async () => Promise.resolve({} as RecipeDetailDto),
  toggleBookmark: async () => Promise.resolve(),
  fetchRecipes: async () => Promise.resolve({ content: [], totalPages: 0 }),
  searchQuery: "",
  setSearchQuery: () => {},
  searchRecipes: async () => Promise.resolve(),
  getRecipeDetail: async () => Promise.resolve({} as RecipeDetailDto),
  fetchMultiSearchRecipes: async () => Promise.resolve([]), // 초기값으로 빈 배열 반환
});

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<RecipeSimpleDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchRecipes = async (params?: {
    search?: string;
    src?: string;
    page?: number;
    size?: number;
  }): Promise<RecipePageResponse> => {
    try {
      // 검색 쿼리와 src, 페이지 및 사이즈를 포함한 요청
      const response = await axios.get<RecipePageResponse>(
        `${apiUrl}/api/recipes`,
        {
          params: {
            "search-query": params?.search || "", // search-query를 사용하여 검색어 전달
            src: params?.src || "", // src를 설정할 수 있음, 기본적으로 비어있음
            page: params?.page || 1, // 기본 페이지 0
            size: params?.size || 18, // 기본 사이즈 18
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
          withCredentials: true,
        }
      );
      console.log("Response data:", response.data); // 응답 데이터 확인
      // 응답 데이터 처리
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      throw error;
    }
  };

  const fetchMultiSearchRecipes = async (params?: {
    food1?: string;
    food2?: string;
    food3?: string;
  }): Promise<RecipeSimpleDto[]> => {
    try {
      const response = await axios.get<RecipeSimpleDto[]>(`${apiUrl}/api/recipes`, {
        params: {
          food1: params?.food1 || "",
          food2: params?.food2 || "",
          food3: params?.food3 || "",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });
      console.log("Fetched multi-search recipes:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch multi-search recipes:", error);
      throw error;
    }
  };

  const getRecipeDetail = async (
    recipeId: string
  ): Promise<RecipeDetailDto> => {
    try {
      const response = await axios.get<RecipeDetailDto>(
        `${apiUrl}/api/recipes/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
      throw error;
    }
  };

  const addRecipe = async (
    recipe: RecipeRegisterDto & {
      recipeMainPhoto: string;
      recipeStepPhotos: string[];
    }
  ): Promise<RecipeDetailDto> => {
    try {
      const formData = new FormData();
      formData.append(
        "recipeRegisterDto",
        JSON.stringify({
          recipeTitle: recipe.recipeTitle,
          recipeFoodDetails: recipe.recipeFoodDetails,
          recipeSteps: recipe.recipeSteps,
          recipeIsVisibility: recipe.recipeIsVisibility,
        })
      );
      if (recipe.recipeMainPhoto) {
        formData.append("recipeMainPhoto", recipe.recipeMainPhoto);
      }
      recipe.recipeStepPhotos.forEach((photo) =>
        formData.append("recipeStepPhotos", photo)
      );

      const response = await axios.post(`${apiUrl}/api/recipes`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });

      const addedRecipe = response.data;
      setRecipes((prev) => [...prev, addedRecipe]);
      return addedRecipe;
    } catch (error) {
      console.error("Failed to add recipe:", error);
      throw error;
    }
  };

  const searchRecipes = async (): Promise<void> => {
    try {
      const response = await fetchRecipes({
        search: searchQuery.trim() || "", // 검색어가 없으면 빈 문자열로 처리
      });
      setRecipes(response.content || response); // API 응답 구조에 따라 수정 필요
    } catch (error) {
      console.error("Failed to search recipes:", error);
    }
  };

  const toggleBookmark = async (recipeId: string): Promise<void> => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/recipes/${recipeId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.recipeId === recipeId
              ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
              : recipe
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        setRecipes,
        addRecipe,
        toggleBookmark,
        fetchRecipes,
        searchQuery,
        searchRecipes,
        setSearchQuery,
        getRecipeDetail,
        fetchMultiSearchRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
