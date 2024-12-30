import React, { createContext, useContext, useState, useEffect } from "react";
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
  foodStorage: "냉장" | "냉동" | "실온";
  foodDescription: string;
  foodListIcon: number;
}

// 프론트의 FridgeItem 인터페이스
interface FridgeItem {
  id: number;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  manufactureDate: string;
  storageMethod: "냉장" | "냉동" | "실온";
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

// Context 타입 정의
interface FridgeContextType {
  fridgeItems: FridgeItem[];
  bucketItems: FridgeItem[];
  addFridgeItem: (item: FridgeItem) => void;
  removeFridgeItem: (id: number) => void;
  updateFridgeItem: (id: number, updatedItem: FridgeItem) => void;
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
      const response = await axios.post("http://localhost:8080/api/my-fridge", item,{withCredentials: true}); // 서버에 아이템 추가
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
    }zr
  };

  // 냉장고 아이템 업데이트
  const updateFridgeItem = async (id: number, updatedItem: FridgeItem) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/my-fridge`, updatedItem,{withCredentials: true}); // 서버에서 아이템 수정
      setFridgeItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? response.data : item))
      );
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
