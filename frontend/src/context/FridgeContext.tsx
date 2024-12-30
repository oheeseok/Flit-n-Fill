import React, { createContext, useContext, useState, useEffect } from "react";
import {fromDescriptionToEnum, fromEnumToDescription} from "../components/enum.tsx";
import axios from "axios";

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
  foodCategory: string;
}

// 프론트의 FridgeItem 인터페이스
interface FridgeItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  manufactureDate: string;
  storageMethod: string;
  remarks: string;
  icon: string;
}
// 변환 함수
const convertToFridgeItem = (foodDetail: FoodDetailDto): FridgeItem => {
  return {
    id: foodDetail.foodId,
    name: foodDetail.foodListName,
    quantity: foodDetail.foodCount,
    unit: foodDetail.foodUnit,
    expirationDate: foodDetail.foodExpDate,  // 문자열로 변환된 날짜
    manufactureDate: foodDetail.foodProDate, // 문자열로 변환된 날짜
    storageMethod: foodDetail.foodStorage,
    remarks: foodDetail.foodDescription,
    icon: `icon-${foodDetail.foodListIcon}`,  // 아이콘은 백엔드에서 받은 숫자값을 기반으로 문자열로 변환
  };
};

// FridgeItem -> FoodDetailDto 변환 함수
const convertToFoodDetailDto = (fridgeItem: FridgeItem): FoodDetailDto => {
  return {
    foodId: fridgeItem.id,
    foodListName: fridgeItem.name,
    foodRegistDate: new Date().toISOString().split('T')[0], // 예시로 현재 날짜를 사용 (백엔드에서 원하는 형식에 맞춰 조정)
    foodCount: fridgeItem.quantity,
    foodUnit: fridgeItem.unit, // unit을 다시 Enum 값으로 변환하는 함수 필요
    foodProDate: fridgeItem.manufactureDate, // 문자열 그대로 사용
    foodExpDate: fridgeItem.expirationDate, // 문자열 그대로 사용
    foodStorage: fridgeItem.storageMethod, // storageMethod를 다시 Enum 값으로 변환하는 함수 필요
    foodDescription: fridgeItem.remarks,
    foodListIcon: parseInt(fridgeItem.icon.split('-')[1], 10), // 'icon-1' 형태에서 숫자만 추출
    foodCategory: "INGREDIENT", // foodCategory는 backend에서 받아서 ��어야함
  };
};

// Context 타입 정의
interface FridgeContextType {
  fridgeItems: FridgeItem[];
  bucketItems: FridgeItem[];
  addFridgeItem: (item: Partial<FridgeItem>) => void;
  removeFridgeItem: (id: number) => void;
  updateFridgeItem: (id: number, updatedItem : FridgeItem) => void;
  filterByStorageMethod: (method: "냉장" | "냉동" | "실온") => FridgeItem[];
  addToBucket: (item: FridgeItem) => void;
  removeFromBucket: (id: number) => void;
  fetchFridgeItems: () => Promise<void>; // 비동기 함수로 수정
}

// 기본 Context 값 설정
const FridgeContext = createContext<FridgeContextType>({
  fridgeItems: [],
  bucketItems: [],
  addFridgeItem: () => {},
  removeFridgeItem: () => {},
  updateFridgeItem: () => {},
  filterByStorageMethod: () => [],
  addToBucket: () => {},
  removeFromBucket: () => {},
  fetchFridgeItems: async () => {}, // 비어 있는 비동기 함수로 설정
});


// Provider 컴포넌트
export const FridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [bucketItems, setBucketItems] = useState<FridgeItem[]>([]);

  // useEffect(() => {
  //   // 상태 업데이트 후 실행될 코드
  //   console.log("Fridge items updated:", fridgeItems);
  // }, [fridgeItems]); // fridgeItems가 변경될 때마다 실행

  // axios로 서버에서 데이터를 가져오기
  const fetchFridgeItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/my-fridge", {withCredentials: true}); // 서버에서 데이터를 받아오는 API 경로
      // 서버에서 받은 데이터가 리스트이므로, 각 아이템을 변환하여 새로운 리스트로 만듬
      const transformedItems = response.data.map((foodDetail: FoodDetailDto) => convertToFridgeItem(foodDetail));

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
    setBucketItems((prevItems) =>
        prevItems.find((prevItem) => prevItem.id === item.id)
            ? prevItems
            : [...prevItems, item]
    );
  };

  // 버킷에서 아이템 삭제
  const removeFromBucket = (id: number) => {
    setBucketItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 냉장고에 아이템 추가
  const addFridgeItem = async (item: FridgeItem) => {
    try {
      const dto = convertToFoodDetailDto(item);
      console.log("Adding item to fridge:", dto);
      const response = await axios.post("http://localhost:8080/api/my-fridge", dto,{withCredentials: true}); // 서버에 아이템 추가
      setFridgeItems((prevItems) => [...prevItems, response.data]);
    } catch (error) {
      console.error("Error adding fridge item", error);
    }
  };

  // 냉장고에서 아이템 삭제
  const removeFridgeItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/my-fridge/${id}`, {withCredentials: true}); // 서버에서 아이템 삭제
      setFridgeItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing fridge item", error);
    }
  };

  // 냉장고 아이템 업데이트
  const updateFridgeItem = async (id: number, updatedItem: Partial<FridgeItem>) => {
    try {
      console.log("Updated item", updatedItem);
      await axios.put(`http://localhost:8080/api/my-fridge/${id}`, updatedItem,{withCredentials: true}); // 서버에서 아이템 수정
      await fetchFridgeItems();
    } catch (error) {
      console.error("Error updating fridge item", error);
    }
  };

  // 저장 방법으로 필터링
  const filterByStorageMethod = (method: "냉장" | "냉동" | "실온") => {
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
          }}
      >
        {children}
      </FridgeContext.Provider>
  );
};

// Hook 생성
export const useFridge = () => useContext(FridgeContext)
