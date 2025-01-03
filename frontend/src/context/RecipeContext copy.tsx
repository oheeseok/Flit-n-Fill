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
  recipes: (RecipeSimpleDto | RecipeDetailDto)[];
  setRecipes: React.Dispatch<
    React.SetStateAction<(RecipeSimpleDto | RecipeDetailDto)[]>
  >;
  // addRecipe의 recipeMainPhoto와 recipeStepPhotos를 string으로 변경
  addRecipe: (
    recipe: RecipeRegisterDto & {
      recipeMainPhoto: string; // 업로드된 파일 URL
      recipeStepPhotos: string[]; // 각 단계별 업로드된 파일 URL 배열
    }
  ) => Promise<RecipeDetailDto>;
  toggleBookmark: (recipeId: string) => void;
  fetchRecipes: (params?: {
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<RecipeSimpleDto[]>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getRecipeDetail: (recipeId: string) => Promise<RecipeDetailDto>;
}

const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  setRecipes: () => {},
  addRecipe: async () => Promise.resolve({} as RecipeDetailDto), // Default return type
  toggleBookmark: () => {},
  fetchRecipes: async () => Promise.resolve([]),
  searchQuery: "",
  setSearchQuery: () => {},
  getRecipeDetail: async () => Promise.resolve({} as RecipeDetailDto),
});

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<(RecipeSimpleDto | RecipeDetailDto)[]>(
    []
  ); // Update state to hold both types
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchRecipes = async (params?: {
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<RecipeSimpleDto[]> => {
    try {
      const response = await axios.get<RecipeSimpleDto[]>("/api/recipes", {
        params: {
          sort: params?.sort || "popular",
          search: params?.search || "",
          page: params?.page || 1,
          limit: params?.limit || 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });

      const fetchedRecipes = response.data;
      setRecipes(fetchedRecipes);

      return fetchedRecipes;
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      throw error;
    }
  };

  const getRecipeDetail = async (
    recipeId: string
  ): Promise<RecipeDetailDto> => {
    try {
      const response = await axios.get<RecipeDetailDto>(
        `/api/recipes/${recipeId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
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
      recipeMainPhoto: string; // URL로 처리
      recipeStepPhotos: string[]; // URL 배열로 처리
    }
  ): Promise<RecipeDetailDto> => {
    try {
      const formData = new FormData();

      const recipeRegisterDtoJson = JSON.stringify({
        recipeTitle: recipe.recipeTitle,
        recipeFoodDetails: recipe.recipeFoodDetails,
        recipeSteps: recipe.recipeSteps.map((step) => ({
          seq: step.seq,
          description: step.description,
          photo:
            step.photo ||
            "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png",
        })),
        recipeIsVisibility: recipe.recipeIsVisibility,
      });

      formData.append("recipeRegisterDto", recipeRegisterDtoJson);
      formData.append("recipeMainPhoto", recipe.recipeMainPhoto);

      // POST 요청
      const response = await axios.post("/api/recipes", formData, {
        headers: {
          // Content-Type은 FormData 사용 시 자동으로 설정되므로 생략
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });

      const addedRecipe = response.data;
      setRecipes((prevRecipes) => [...prevRecipes, addedRecipe]);
      return addedRecipe;
    } catch (error) {
      console.error("Failed to add recipe:", error);
      throw error;
    }
  };

  const toggleBookmark = async (recipeId: string) => {
    // 상태 업데이트 전에 현재 상태를 기반으로 업데이트
    setRecipes((prevRecipes) => {
      return prevRecipes.map((recipe) =>
        recipe.recipeId === recipeId
          ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
          : recipe
      );
    });

    try {
      // 서버에 북마크 상태를 업데이트하는 요청 보내기
      await axios.patch(`/api/recipes/${recipeId}`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      // 서버 요청 실패시 상태를 원래대로 되돌리기
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.recipeId === recipeId
            ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
            : recipe
        )
      );
      alert("Failed to toggle bookmark.");
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
        setSearchQuery,
        getRecipeDetail,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);
