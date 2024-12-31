import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

// Recipe 데이터 인터페이스
interface RecipeSimpleDto {
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

interface RecipeUpdateDto {
  recipeTitle: string;
  recipeMainPhoto: File | string;
  recipeFoodDetails: string;
  recipeStepPhotos: (File | string | null)[];
}

interface RecipeContextType {
  recipes: RecipeDetailDto[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeDetailDto[]>>;
  addRecipe: (recipe: RecipeRegisterDto) => Promise<string>; // recipeId 반환
  toggleBookmark: (index: string) => void; // 즐찾 상태 토글 함수
  getAllRecipes: (params?: {
    sort?: string;
    search?: string;
  }) => Promise<RecipeDetailDto[]>;
  searchQuery: string; // 검색 상태
  setSearchQuery: (query: string) => void; // 검색 상태 업데이트 함수
  getRecipeDetail: (recipeId: string) => RecipeDetailDto;
}

// Context 기본 값
const RecipeContext = createContext<RecipeContextType>({
  recipes: [],
  setRecipes: () => {},
  addRecipe: async () => Promise.resolve(""), // 빈 객체를 RecipeDetailDto로 타입 단언하여 반환
  toggleBookmark: () => {},
  getAllRecipes: async () => Promise.resolve([]),
  searchQuery: "", // 기본 검색 상태
  setSearchQuery: () => {},
  getRecipeDetail: () => ({} as RecipeDetailDto),
});

// Provider 컴포넌트
export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<RecipeDetailDto[]>([]); // 빈 배열로 초기화
  // const [recipes, setRecipes] = useState<RecipeSimpleDto[]>(() => {
  //   const storedRecipes = localStorage.getItem("recipes");
  //   return storedRecipes ? JSON.parse(storedRecipes) : [];
  // });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const addRecipe = async (recipe: RecipeRegisterDto): Promise<string> => {
    // setRecipes((prev) => {
    //   const updatedRecipes = [...prev, recipe];
    //   localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    //   return updatedRecipes;
    // });
    // // 새로 추가된 레시피의 인덱스를 반환
    // return recipes.length;

    console.log("------------- addRecipe()");
    console.log(">> 입력데이터: ", recipe);
    const formData = new FormData();

    // recipeRegisterDto JSON 데이터 추가
    formData.append(
      "recipeRegisterDto",
      JSON.stringify({
        recipeTitle: recipe.recipeTitle,
        recipeFoodDetails: recipe.recipeFoodDetails,
        recipeSteps: recipe.recipeSteps,
        recipeIsVisibility: recipe.recipeIsVisibility,
      })
    );

    // recipeMainPhoto 파일을 formData에 추가
    formData.append("recipeMainPhoto", recipe.recipeMainPhoto);

    // recipeStepPhotos 배열을 formData에 추가
    recipe.recipeStepPhotos?.forEach((photo, index) => {
      if (photo) {
        formData.append(`recipeStepPhotos[${index}]`, photo);
      }
      // else {
      //   formData.append(`recipeStepPhotos[${index}]`, null);
      // }
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("레시피 추가 성공:", response.data);
      // 서버에서 반환된 RecipeDetailDto 데이터
      const addedRecipe: RecipeDetailDto = response.data;

      // 새 레시피를 기존 레시피 목록에 추가
      setRecipes((prevRecipes) => [...(prevRecipes || []), addedRecipe]);

      return response.data.recipeId; // recipeId 반환환
    } catch (error) {
      console.error("레시피 추가 실패:", error);
      return "";
    }
  };

  const toggleBookmark = async (index: string) => {
    try {
      const recipe = recipes[index];
      const updatedBookmarkStatus = !recipe.recipeIsBookmarked;

      // 서버에 북마크 상태 업데이트 요청
      await axios.patch(`/api/recipes/${recipe.recipeId}`, {
        isBookmarked: updatedBookmarkStatus,
      });

      // 로컬 상태 업데이트
      setRecipes((prevRecipes) => {
        const updatedRecipes = prevRecipes.map((r, i) =>
          i === index ? { ...r, recipeIsBookmarked: updatedBookmarkStatus } : r
        );
        return updatedRecipes;
      });
    } catch (error) {
      console.error("북마크 업데이트 실패:", error);
      alert("북마크 업데이트 중 문제가 발생했습니다.");
    }
    // setRecipes((prevRecipes) => {
    //   const updatedRecipes = prevRecipes.map((recipe, i) =>
    //     i === index
    //       ? { ...recipe, recipeIsBookmarked: !recipe.recipeIsBookmarked }
    //       : recipe
    //   );
    //   localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    //   return updatedRecipes;
    // });
  };

  const getAllRecipes = useCallback(
    async (params?: { sort?: string; search?: string }) => {
      // const storedRecipes = localStorage.getItem("recipes");
      try {
        const response = await axios.get("/api/recipes", {
          params: {
            sort: params?.sort || "popular", // 기본값은 popular
            search: params?.search || "",
          },
          headers: { "Content-Type": "application/json" },
        });
        // setRecipes(response.data);
      } catch (error) {
        console.error("레시피 조회 실패:", error);
        alert("레시피 조회 중 문제가 발생했습니다.");
      }

      //   const allRecipes: RecipeSimpleDto[] = recipes ? JSON.parse(recipes) : [];

      //   let filteredRecipes = allRecipes;

      //   if (params?.search) {
      //     filteredRecipes = filteredRecipes.filter((recipe) =>
      //       recipe.recipeFoodDetails
      //         .toLowerCase()
      //         .includes(params.search.toLowerCase())
      //     );
      //   }

      //   if (params?.sort) {
      //     if (params.sort === "latest") {
      //       filteredRecipes = filteredRecipes.reverse();
      //     } else if (params.sort === "oldest") {
      //       // Assuming the recipes are in latest order by default
      //       filteredRecipes = [...filteredRecipes].reverse();
      //     }
      //   }

      //   setRecipes(filteredRecipes); // 검색 결과를 상태로 설정
    },
    []
  );

  const getRecipeDetail = async (
    recipeId: string
  ): Promise<RecipeDetailDto> => {
    try {
      const response = await axios.get<RecipeDetailDto>(
        `http://localhost:8080/recipes/${recipeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      throw new Error("Failed to fetch recipe details.");
    }
  };

  // useEffect(() => {
  //   localStorage.setItem("recipes", JSON.stringify(recipes));
  // }, [recipes]);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        setRecipes,
        addRecipe,
        toggleBookmark,
        getAllRecipes,
        searchQuery,
        setSearchQuery,
        getRecipeDetail,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

// Hook 생성
export const useRecipe = () => useContext(RecipeContext);
