import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

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
  recipeIsVisibility: boolean; // 공개 비공개 여부
  isBookmarked: boolean;
}

interface RecipeContextType {
  recipes: RecipeData[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeData[]>>;
  addRecipe: (recipe: RecipeData) => number; // 인덱스를 반환하도록 수정
  toggleBookmark: (index: number) => void; // 즐찾 상태 토글 함수
  fetchRecipes: (params?: { sort?: string; search?: string }) => Promise<void>; // 레시피 가져오기 함수
  searchQuery: string; // 검색 상태
  setSearchQuery: (query: string) => void; // 검색 상태 업데이트 함수
}

// Context 기본 값
const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  setRecipes: () => {},
  addRecipe: () => -1,
  toggleBookmark: () => {},
  fetchRecipes: async () => {},
  searchQuery: "", // 기본 검색 상태
  setSearchQuery: () => {},
});

// Provider 컴포넌트
export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<RecipeData[]>(() => {
    const storedRecipes = localStorage.getItem("recipes");
    return storedRecipes ? JSON.parse(storedRecipes) : [];
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const addRecipe = (recipe: RecipeData): number => {
    setRecipes((prev) => {
      const updatedRecipes = [...prev, recipe];
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      return updatedRecipes;
    });

    // 새로 추가된 레시피의 인덱스를 반환
    return recipes.length;
  };

  const toggleBookmark = (index: number) => {
    setRecipes((prevRecipes) => {
      const updatedRecipes = prevRecipes.map((recipe, i) =>
        i === index ? { ...recipe, isBookmarked: !recipe.isBookmarked } : recipe
      );
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      return updatedRecipes;
    });
  };

  const fetchRecipes = useCallback(
    async (params?: { sort?: string; search?: string }) => {
      const storedRecipes = localStorage.getItem("recipes");
      const allRecipes: RecipeData[] = storedRecipes
        ? JSON.parse(storedRecipes)
        : [];

      let filteredRecipes = allRecipes;

      if (params?.search) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.recipeFoodDetails
              .toLowerCase()
              .includes(params.search!.toLowerCase()) // Non-null assertion 사용
        );
      }

      if (params?.sort) {
        if (params.sort === "latest") {
          filteredRecipes = filteredRecipes.reverse();
        } else if (params.sort === "oldest") {
          // Assuming the recipes are in latest order by default
          filteredRecipes = [...filteredRecipes].reverse();
        }
      }

      setRecipes(filteredRecipes); // 검색 결과를 상태로 설정
    },
    []
  );

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

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
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook 생성
export const useRecipe = () => useContext(RecipeContext);
