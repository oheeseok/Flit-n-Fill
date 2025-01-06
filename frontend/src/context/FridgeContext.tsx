import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const apiUrl = import.meta.env.VITE_API_URL;

// 백엔드에서 받은 FoodDetailDto 타입의 데이터
interface FoodDetailDto {
  foodId: number;
  foodListName: string;
  foodRegistDate: string; // LocalDate -> string (예: '2024-12-30')
  foodCount: number;
  foodUnit: string;
  foodProDate: string; // LocalDate -> string (예: '2024-12-30')
  foodExpDate: string; // LocalDate -> string (예: '2024-12-30')
  foodStorage: string;
  foodDescription: string;
  foodListIcon: number;
  foodListId: number;
  foodCategory: string;
}

// 프론트의 FridgeItem 인터페이스
export interface FridgeItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  manufactureDate: string;
  storageMethod: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE";
  remarks: string;
  icon: string;
  foodListId?: number;
  mainCategory?: string; // 추가
  subCategory?: string; // 추가
  detailCategory?: string; // 추가
}
// 변환 함수
const convertToFridgeItem = (
  foodDetail: FoodDetailDto
): {
  unit: string;
  quantity: number;
  storageMethod: string;
  name: string;
  icon: string;
  manufactureDate: string;
  foodListId: number;
  id: number;
  remarks: string;
  expirationDate: string;
} => {
  return {
    id: foodDetail.foodId,
    name: foodDetail.foodListName,
    quantity: foodDetail.foodCount,
    unit: foodDetail.foodUnit,
    expirationDate: foodDetail.foodExpDate, // 문자열로 변환된 날짜
    manufactureDate: foodDetail.foodProDate, // 문자열로 변환된 날짜
    storageMethod: foodDetail.foodStorage,
    remarks: foodDetail.foodDescription,
    foodListId: foodDetail.foodListId,
    icon: `assets/icons/${foodDetail.foodListIcon}.png`, // 아이콘은 백엔드에서 받은 숫자값을 기반으로 문자열로 변환
  };
};

// FridgeItem -> FoodDetailDto 변환 함수
const convertToFoodDetailDto = (
  fridgeItem: FridgeItem
): {
  foodCount: number;
  foodDescription: string;
  foodListName: string;
  foodId: number;
  foodListId: number | undefined;
  foodRegistDate: string;
  foodExpDate: string;
  foodListIcon: string;
  foodUnit: string;
  foodStorage: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE";
  foodProDate: string;
  foodCategory: string;
} => {
  return {
    foodId: fridgeItem.id,
    foodListName: fridgeItem.name,
    foodRegistDate: new Date().toISOString().split("T")[0], // 예시로 현재 날짜를 사용 (백엔드에서 원하는 형식에 맞춰 조정)
    foodCount: fridgeItem.quantity,
    foodUnit: fridgeItem.unit, // unit을 다시 Enum 값으로 변환하는 함수 필요
    foodProDate: fridgeItem.manufactureDate, // 문자열 그대로 사용
    foodExpDate: fridgeItem.expirationDate, // 문자열 그대로 사용
    foodStorage: fridgeItem.storageMethod, // storageMethod를 다시 Enum 값으로 변환하는 함수 필요
    foodDescription: fridgeItem.remarks,
    foodListIcon: fridgeItem.icon, // 'icon-1' 형태에서 숫자만 추출
    foodListId: fridgeItem.foodListId, // foodListId를 그대로 사용
    foodCategory: fridgeItem.foodListId ? "INGREDIENT" : "COOKED", // foodCategory는 backend에서 받아서 ��어야함
  };
};

// Context 타입 정의
interface FridgeContextType {
  fridgeItems: FridgeItem[];
  bucketItems: FridgeItem[];
  addFridgeItem: (item: FridgeItem) => void;
  removeFridgeItem: (id: number) => void;
  updateFridgeItem: (updatedItem: Partial<FridgeItem>) => Promise<void>;
  filterByStorageMethod: (
    method: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
  ) => FridgeItem[];
  addToBucket: (item: FridgeItem) => void;
  removeFromBucket: (id: number) => void;
  fetchFridgeItems: () => Promise<void>; // 비동기 함수로 수정
  requestAddIngredient: (requestFood: string) => Promise<void>;
  addFridgeItemToCart: (id: number) => void;
}

// 기본 Context 값 설정
const FridgeContext = createContext<FridgeContextType>({
  fridgeItems: [],
  bucketItems: [],
  addFridgeItem: () => {},
  removeFridgeItem: () => {},
  updateFridgeItem: async () => {},
  filterByStorageMethod: () => [],
  addToBucket: () => {},
  removeFromBucket: () => {},
  fetchFridgeItems: async () => {}, // 비어 있는 비동기 함수로 설정
  requestAddIngredient: async () => {},
  addFridgeItemToCart: () => {},
});

// Provider 컴포넌트
export const FridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [bucketItems, setBucketItems] = useState<FridgeItem[]>([]);

  // axios로 서버에서 데이터를 가져오기
  const fetchFridgeItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/my-fridge`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      }); // 서버에서 데이터를 받아오는 API 경로
      // 서버에서 받은 데이터가 리스트이므로, 각 아이템을 변환하여 새로운 리스트로 만듬
      const transformedItems = response.data.map((foodDetail: FoodDetailDto) =>
        convertToFridgeItem(foodDetail)
      );

      // 변환된 아이템 리스트를 상태에 설정
      setFridgeItems(transformedItems);

      // 콘솔에 출력하여 확인
      console.log(transformedItems);
    } catch (error) {
      console.error("Fridge items could not be fetched", error);
    }
  };

  // 버킷에 아이템 추가
  const addToBucket = (item: FridgeItem) => {
    if (item.foodListId === null) {
      console.warn("Cooked items cannot be added to the bucket.");
      Swal.fire({
        icon: "warning",
        title: "추가 불가",
        text: "요리는 버킷에 추가할 수 없습니다.",
      });
      return;
    }
    // 이미 버킷에 존재하는 아이템인지 확인
    setBucketItems((prevItems) => {
      // 아이템이 이미 버킷에 있으면 삭제
      if (prevItems.find((prevItem) => prevItem.id === item.id)) {
        return prevItems.filter((prevItem) => prevItem.id !== item.id);
      } else {
        // 없으면 추가
        return [...prevItems, item];
      }
    });
  };

  // 버킷에서 아이템 삭제
  const removeFromBucket = (id: number) => {
    setBucketItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 냉장고에 아이템 추가
  const addFridgeItem = async (item: FridgeItem) => {
    try {
      const dto = convertToFoodDetailDto(item);
      const response = await axios.post(`${apiUrl}/api/my-fridge`, dto, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      }); // 서버에 아이템 추가
      setFridgeItems((prevItems) => [...prevItems, response.data]);
    } catch (error) {
      console.error("Error adding fridge item", error);
      Swal.fire({
        icon: "error",
        title: "추가 실패",
        text: "재료 등록에 실패했습니다.",
      });
      return;
    }
  };

  // 냉장고에서 아이템 삭제
  const removeFridgeItem = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/my-fridge/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      }); // 서버에서 아이템 삭제
      setFridgeItems((prevItems) => prevItems.filter((item) => item.id !== id));
      removeFromBucket(id);
    } catch (error) {
      console.error("Error removing fridge item", error);
    }
  };

  const updateFridgeItem = async (updatedItem: Partial<FridgeItem>) => {
    const convertedItem = {
      foodId: updatedItem.id,
      foodCount: updatedItem.quantity,
      foodStorage: updatedItem.storageMethod,
      foodUnit: updatedItem.unit,
      foodProDate: updatedItem.manufactureDate,
      foodExpDate: updatedItem.expirationDate,
      foodDescription: updatedItem.remarks,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/api/my-fridge/${convertedItem.foodId}`,
        convertedItem,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      ); // 서버에서 아이템 수정
      // 응답 상태가 200이 아닐 경우
      if (response.status !== 200) {
        throw new Error(response.data || "알 수 없는 오류가 발생했습니다.");; // 이 경우 fetchFridgeItems는 호출하지 않음
      }
      await fetchFridgeItems();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        // response.data를 string으로 단언
        const errorMessage = (error.response.data as string)
          .split("Location:")[0]
          .trim();
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  // 재료 등록 요청하기
  const requestAddIngredient = async (requestFood: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/my-fridge/request`,
        requestFood,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      console.log("재료 등록 요청 성공:", response.data);
      return response.data; // 성공적으로 처리된 데이터를 반환
    } catch (error: any) {
      console.error(
        "재료 등록 요청 중 오류 발생:",
        error.response?.data || error.message
      );
      throw error; // 호출한 쪽에서 에러를 처리할 수 있도록 던짐
    }
  };

  const addFridgeItemToCart = async (id: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/my-fridge/add/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        }
      );
      console.log("장바구니 추가 성공: ", response.data);
    } catch (error) {
      console.error("장바구니 추가에 실패했습니다: ", error);
    }
  };

  // 저장 방법으로 필터링
  const filterByStorageMethod = (
    method: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
  ) => {
    return fridgeItems.filter((item) => item.storageMethod === method);
  };

  // 컴포넌트 마운트 시 서버에서 아이템들 가져오기
  useEffect(() => {
    fetchFridgeItems();
  }, []);

  return (
    <FridgeContext.Provider
      value={{
        fridgeItems,
        bucketItems,
        addFridgeItem,
        removeFridgeItem,
        updateFridgeItem,
        filterByStorageMethod,
        addToBucket,
        removeFromBucket,
        fetchFridgeItems,
        requestAddIngredient,
        addFridgeItemToCart,
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
};

// Hook 생성
export const useFridge = () => useContext(FridgeContext);
