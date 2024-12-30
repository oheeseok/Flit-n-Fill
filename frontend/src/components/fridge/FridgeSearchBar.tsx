import { useEffect, useState } from "react";
import "../../styles/fridge/FridgeSearchBar.css";

import Swal from "sweetalert2";
import { CATEGORY_DATA } from "../../data/categoryData";

interface FridgeSearchBarProps {
  onSearch: (
    mainCategory: string,
    subCategory?: string,
    detailCategory?: string
  ) => void;
  disabled?: boolean;
}

const FridgeSearchBar: React.FC<FridgeSearchBarProps> = ({
  onSearch,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (disabled) {
      setInputValue("");
    }
  }, [disabled]);

  const handleSearch = () => {
    if (disabled) return; // 비활성화 상태일 경우 검색 XXX

    if (inputValue.trim() === "") {
      Swal.fire({
        icon: "info",
        title: "검색어를 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    let found = false;

    for (const [mainCategory, mainData] of Object.entries(CATEGORY_DATA)) {
      // 1. 소분류 탐색
      for (const [subCategory, subData] of Object.entries(mainData.중분류)) {
        if (subData.소분류) {
          for (const [detailCategory, _] of Object.entries(subData.소분류)) {
            if (detailCategory === inputValue) {
              onSearch(mainCategory, subCategory, detailCategory);
              found = true;
              break;
            }
          }
        }
        if (found) break;

        // 2. 중분류 탐색
        if (subCategory === inputValue) {
          onSearch(mainCategory, subCategory);
          found = true;
          break;
        }
      }

      if (found) break;
    }

    // 결과가 없는 경우
    if (!found) {
      Swal.fire({
        icon: "error",
        title: "검색 결과가 없습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="fridge-searchbar-container">
      <input
        type="text"
        placeholder="Search"
        className="fridge-searchbar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <div onClick={handleSearch} className="fridge-search-icon-container">
        <button
          className="fridge-search-icon-button"
          type="button"
          disabled={disabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 29 29"
            fill="none"
          >
            <path
              d="M28.0358 26.6218L20.4838 19.0698C22.2986 16.8911 23.2035 14.0966 23.0104 11.2677C22.8173 8.43873 21.541 5.79315 19.447 3.88128C17.353 1.9694 14.6025 0.938435 11.7677 1.00285C8.93293 1.06726 6.23211 2.22209 4.2271 4.2271C2.22209 6.23211 1.06726 8.93293 1.00285 11.7677C0.938435 14.6025 1.9694 17.353 3.88128 19.447C5.79315 21.541 8.43873 22.8173 11.2677 23.0104C14.0966 23.2035 16.8911 22.2986 19.0698 20.4838L26.6218 28.0358L28.0358 26.6218ZM3.03576 12.0358C3.03576 10.2557 3.5636 8.51567 4.55253 7.03563C5.54147 5.55559 6.94707 4.40203 8.59161 3.72084C10.2361 3.03966 12.0457 2.86143 13.7916 3.20869C15.5374 3.55596 17.141 4.41313 18.3997 5.6718C19.6584 6.93047 20.5156 8.53412 20.8628 10.2799C21.2101 12.0258 21.0319 13.8354 20.3507 15.4799C19.6695 17.1244 18.5159 18.5301 17.0359 19.519C15.5559 20.5079 13.8158 21.0358 12.0358 21.0358C9.64962 21.0331 7.36198 20.0841 5.67472 18.3968C3.98747 16.7095 3.03841 14.4219 3.03576 12.0358Z"
              fill="#979797"
              stroke="#979797"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FridgeSearchBar;
