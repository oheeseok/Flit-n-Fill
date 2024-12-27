import React, { createContext, useContext, useState, useEffect } from "react";

// FridgeItem 데이터 구조 정의
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
});

// Provider 컴포넌트
export const FridgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(() => {
    const storedItems = localStorage.getItem("fridgeItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const [bucketItems, setBucketItems] = useState<FridgeItem[]>(() => {
    const storedBucketItems = localStorage.getItem("bucketItems");
    return storedBucketItems ? JSON.parse(storedBucketItems) : [];
  });

  const addToBucket = (item: FridgeItem) => {
    setBucketItems((prevItems) =>
      prevItems.find((prevItem) => prevItem.id === item.id)
        ? prevItems
        : [...prevItems, item]
    );
  };

  const removeFromBucket = (id: number) => {
    setBucketItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addFridgeItem = (item: FridgeItem) => {
    setFridgeItems((prevItems) => {
      const updatedItems = [...prevItems, { ...item, id: Date.now() }];
      localStorage.setItem("fridgeItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const removeFridgeItem = (id: number) => {
    setFridgeItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("fridgeItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const updateFridgeItem = (id: number, updatedItem: FridgeItem) => {
    setFridgeItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? updatedItem : item
      );
      localStorage.setItem("fridgeItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const filterByStorageMethod = (method: "냉장" | "냉동" | "실온") => {
    return fridgeItems.filter((item) => item.storageMethod === method);
  };

  useEffect(() => {
    localStorage.setItem("bucketItems", JSON.stringify(bucketItems));
  }, [bucketItems]);

  useEffect(() => {
    localStorage.setItem("fridgeItems", JSON.stringify(fridgeItems));
  }, [fridgeItems]);

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
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
};

// Hook 생성
export const useFridge = () => useContext(FridgeContext);
