// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// // 백엔드에서 받은 FoodDetailDto 타입의 데이터
// interface FoodDetailDto {
//   foodId: number;
//   foodListName: string;
//   foodRegistDate: string; // LocalDate -> string (예: '2024-12-30')
//   foodCount: number;
//   foodUnit: string;
//   foodProDate: string; // LocalDate -> string (예: '2024-12-30')
//   foodExpDate: string; // LocalDate -> string (예: '2024-12-30')
//   foodStorage: string;
//   foodDescription: string;
//   foodListIcon: number;
//   foodListId: number;
//   foodCategory: string;
// }

// // 프론트의 FridgeItem 인터페이스
// export interface FridgeItem {
//   id: number;
//   name: string;
//   quantity: number;
//   unit: string;
//   expirationDate: string;
//   manufactureDate: string;
//   storageMethod: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE";
//   remarks: string;
//   icon: string;
//   foodListId?: number;
//   mainCategory?: string;
//   subCategory?: string;
//   detailCategory?: string;
// }

// // 변환 함수
// const convertToFridgeItem = (foodDetail: FoodDetailDto): FridgeItem => ({
//   id: foodDetail.foodId,
//   name: foodDetail.foodListName,
//   quantity: foodDetail.foodCount,
//   unit: foodDetail.foodUnit,
//   expirationDate: foodDetail.foodExpDate,
//   manufactureDate: foodDetail.foodProDate,
//   storageMethod: foodDetail.foodStorage as
//     | "REFRIGERATED"
//     | "FROZEN"
//     | "ROOM_TEMPERATURE",
//   remarks: foodDetail.foodDescription,
//   foodListId: foodDetail.foodListId,
//   icon: `assets/icons/${foodDetail.foodListIcon}.png`,
// });

// // FridgeItem -> FoodDetailDto 변환 함수
// const convertToFoodDetailDto = (
//   fridgeItem: Partial<FridgeItem>
// ): Partial<FoodDetailDto> => ({
//   foodId: fridgeItem.id!,
//   foodListName: fridgeItem.name!,
//   foodRegistDate: new Date().toISOString().split("T")[0],
//   foodCount: fridgeItem.quantity!,
//   foodUnit: fridgeItem.unit!,
//   foodProDate: fridgeItem.manufactureDate!,
//   foodExpDate: fridgeItem.expirationDate!,
//   foodStorage: fridgeItem.storageMethod!,
//   foodDescription: fridgeItem.remarks!,
//   foodListIcon: parseInt(fridgeItem.icon?.replace(/\D/g, "") || "0", 10), // 숫자만 추출
//   foodListId: fridgeItem.foodListId,
//   foodCategory: fridgeItem.foodListId ? "INGREDIENT" : "COOKED",
// });

// // Context 타입 정의
// interface FridgeContextType {
//   fridgeItems: FridgeItem[];
//   bucketItems: FridgeItem[];
//   addFridgeItem: (item: FridgeItem) => void;
//   removeFridgeItem: (id: number) => void;
//   updateFridgeItem: (id: number, updatedItem: Partial<FridgeItem>) => void;
//   filterByStorageMethod: (
//     method: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
//   ) => FridgeItem[];
//   addToBucket: (item: FridgeItem) => void;
//   removeFromBucket: (id: number) => void;
//   fetchFridgeItems: () => Promise<void>;
// }

// // 기본 Context 값 설정
// const FridgeContext = createContext<FridgeContextType>({
//   fridgeItems: [],
//   bucketItems: [],
//   addFridgeItem: () => {},
//   removeFridgeItem: () => {},
//   updateFridgeItem: () => {},
//   filterByStorageMethod: () => [],
//   addToBucket: () => {},
//   removeFromBucket: () => {},
//   fetchFridgeItems: async () => {},
// });

// // Provider 컴포넌트
// export const FridgeProvider: React.FC = ({ children }) => {
//   const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
//   const [bucketItems, setBucketItems] = useState<FridgeItem[]>([]);

//   const fetchFridgeItems = async () => {
//     try {
//       const response = await axios.get<FoodDetailDto[]>(
//         "http://localhost:8080/api/my-fridge",
//         {
//           withCredentials: true,
//         }
//       );
//       const transformedItems = response.data.map(convertToFridgeItem);
//       setFridgeItems(transformedItems);
//     } catch (error) {
//       console.error("Error fetching fridge items:", error);
//     }
//   };

//   const addToBucket = (item: FridgeItem) => {
//     setBucketItems((prevItems) =>
//       prevItems.find((prevItem) => prevItem.id === item.id)
//         ? prevItems
//         : [...prevItems, item]
//     );
//   };

//   const removeFromBucket = (id: number) => {
//     setBucketItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const addFridgeItem = async (item: FridgeItem) => {
//     try {
//       const dto = convertToFoodDetailDto(item);
//       const response = await axios.post(
//         "http://localhost:8080/api/my-fridge",
//         dto,
//         {
//           withCredentials: true,
//         }
//       );
//       setFridgeItems((prevItems) => [
//         ...prevItems,
//         convertToFridgeItem(response.data),
//       ]);
//     } catch (error) {
//       console.error("Error adding fridge item:", error);
//     }
//   };

//   const removeFridgeItem = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/my-fridge/${id}`, {
//         withCredentials: true,
//       });
//       setFridgeItems((prevItems) => prevItems.filter((item) => item.id !== id));
//       removeFromBucket(id);
//     } catch (error) {
//       console.error("Error removing fridge item:", error);
//     }
//   };

//   const updateFridgeItem = async (
//     id: number,
//     updatedItem: Partial<FridgeItem>
//   ) => {
//     try {
//       const dto = convertToFoodDetailDto(updatedItem);
//       await axios.put(`http://localhost:8080/api/my-fridge/${id}`, dto, {
//         withCredentials: true,
//       });
//       await fetchFridgeItems();
//     } catch (error) {
//       console.error("Error updating fridge item:", error);
//     }
//   };

//   const filterByStorageMethod = (
//     method: "REFRIGERATED" | "FROZEN" | "ROOM_TEMPERATURE"
//   ) => fridgeItems.filter((item) => item.storageMethod === method);

//   useEffect(() => {
//     fetchFridgeItems();
//   }, []);

//   return (
//     <FridgeContext.Provider
//       value={{
//         fridgeItems,
//         bucketItems,
//         addFridgeItem,
//         removeFridgeItem,
//         updateFridgeItem,
//         filterByStorageMethod,
//         addToBucket,
//         removeFromBucket,
//         fetchFridgeItems,
//       }}
//     >
//       {children}
//     </FridgeContext.Provider>
//   );
// };

// // Hook 생성
// export const useFridge = () => useContext(FridgeContext);
