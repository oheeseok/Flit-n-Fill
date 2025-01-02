import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Recipe 데이터 인터페이스
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

interface RecipeDetailDto {
  recipeId: string;
  recipeTitle: string;
  recipeMainPhoto: File | string;
  recipeFoodDetails: string;
  recipeSteps: RecipeStepDto[];
  recipeIsVisibility: boolean;
  recipeIsBookmarked: boolean;
  recipeCreatedDate: Date;
  userNickname: string;
  userProfile: string;
}

interface RecipeStepDto {
  seq: number;
  photo: string;
  description: string;
}

interface RecipeRegisterDto {
  recipeTitle: string;
  recipeMainPhoto: File | string;
  recipeFoodDetails: string;
  recipeSteps: { seq: number; description: string }[];
  recipeStepPhotos: (File | string | null)[];
  recipeIsVisibility: boolean;
}

interface RecipeContextType {
  recipes: RecipeSimpleDto[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeSimpleDto[]>>;
  addRecipe: (recipe: RecipeRegisterDto) => Promise<string>;
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
  addRecipe: async () => Promise.resolve(""),
  toggleBookmark: () => {},
  fetchRecipes: async () => Promise.resolve([]),
  searchQuery: "",
  setSearchQuery: () => {},
  getRecipeDetail: async () => Promise.resolve({} as RecipeDetailDto),
});

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<RecipeSimpleDto[]>([]); // RecipeSimpleDto 사용
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
        headers: { "Content-Type": "application/json" },
      });

      const fetchedRecipes = response.data;

      // Check if the fetched recipes are different from the current state before updating
      if (JSON.stringify(fetchedRecipes) !== JSON.stringify(recipes)) {
        setRecipes(fetchedRecipes); // Update only if data is different
      }

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
        `/api/recipes/${recipeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
      throw error;
    }
  };

  const addRecipe = async (recipe: RecipeRegisterDto): Promise<string> => {
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
      formData.append("recipeMainPhoto", recipe.recipeMainPhoto);
      recipe.recipeStepPhotos?.forEach((photo, index) => {
        if (photo) {
          formData.append(`recipeStepPhotos[${index}]`, photo);
        }
      });

      const response = await axios.post("/api/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const addedRecipe = response.data;
      setRecipes((prevRecipes) => [...prevRecipes, addedRecipe]);
      return addedRecipe.recipeId;
    } catch (error) {
      console.error("Failed to add recipe:", error);
      throw error;
    }
  };

  const toggleBookmark = async (recipeId: string) => {
    // Optimistically update the UI before server response
    const updatedRecipes = recipes.map((recipe) =>
      recipe.recipeId === recipeId
        ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
        : recipe
    );
    setRecipes(updatedRecipes);

    try {
      await axios.patch(`/api/recipes/${recipeId}`, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(`Toggled bookmark for recipeId: ${recipeId}`);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      // Revert to original state if toggle fails
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
