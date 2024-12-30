import { useState } from "react";
import "../../styles/common/SearchBar.css";
import SearchIcon from "../common/SearchIcon";
import Swal from "sweetalert2";
import { CATEGORY_DATA } from "../../data/categoryData";

interface FridgeSearchBarProps {
  onSearch: (
    mainCategory: string,
    subCategory?: string,
    detailCategory?: string
  ) => void;
}

const FridgeSearchBar: React.FC<FridgeSearchBarProps> = ({ onSearch }) => {
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

    const searchResults = Object.entries(CATEGORY_DATA).find(
      ([mainCategory, data]) => {
        if (data.중분류.includes(inputValue)) {
          onSearch(mainCategory, inputValue);
          return true;
        }
        if (
          Object.values(data.소분류).some((details) =>
            details.includes(inputValue)
          )
        ) {
          const subCategory = Object.keys(data.소분류).find((key) =>
            data.소분류[key].includes(inputValue)
          );
          if (subCategory) {
            onSearch(mainCategory, subCategory, inputValue);
          }
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
