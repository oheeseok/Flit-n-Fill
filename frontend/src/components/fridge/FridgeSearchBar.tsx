import { useState } from "react";
import "../../styles/fridge/FridgeSearchBar.css";
import SearchIcon from "../common/SearchIcon";
import Swal from "sweetalert2";

interface FridgeSearchBarProps {
  categories: 
  {
    [mainCategory: string]: {
      대분류: string; // 대분류
      중분류: {
        [subCategory: string]: {
          icon: number; // 중분류 아이콘
          foodListId: number; // foodListId
          소분류: {
            [detailCategory: string]: {
              icon: number; // 소분류 아이콘
              foodListId: number; // foodListId
            };
          } | null; // 소분류가 없을 수 있음
        };
      };
    };
  };
  onSearch: (
    mainCategory: string,
    subCategory?: string,
    detailCategory?: string
  ) => void;
}

const FridgeSearchBar: React.FC<FridgeSearchBarProps> = ({
  categories,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    if (inputValue.trim() === "") {
      Swal.fire({
        icon: "info",
        title: "검색어를 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    const searchResults = Object.entries(categories).find(
      ([mainCategory, data]) => {
        // 중분류에서 검색
        const subCategory = Object.keys(data.중분류).find(
          (key) => key === inputValue
        );
        if (subCategory) {
          onSearch(mainCategory, subCategory);
          return true;
        }

        // 소분류에서 검색
        const detailCategory = Object.entries(data.중분류).find(
          ([_, subCategoryData]) =>
            subCategoryData.소분류 &&
            Object.keys(subCategoryData.소분류).includes(inputValue)
        );

        if (detailCategory) {
          const [foundSubCategory, _] = detailCategory;
          onSearch(mainCategory, foundSubCategory, inputValue);
          return true;
        }
        return false;
      }
    );

    if (!searchResults) {
      Swal.fire({
        icon: "error",
        title: "검색 결과가 없습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search"
        className="searchbar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div onClick={handleSearch} className="search-icon-container">
        <SearchIcon />
      </div>
    </div>
  );
};

export default FridgeSearchBar;
