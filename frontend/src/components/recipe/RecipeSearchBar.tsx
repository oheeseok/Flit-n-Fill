import { useRecipe } from "../../context/RecipeContext";
import { useNavigate } from "react-router-dom";
import "../../styles/fridge/FridgeSearchBar.css";
import SearchIcon from "../common/SearchIcon";
import { useState } from "react";
import Swal from "sweetalert2";

const RecipeSearchBar = () => {
  const { setSearchQuery } = useRecipe(); // Context에서 setSearchQuery만 사용
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // 검색 실행 함수
  const handleSearch = () => {
    if (inputValue.trim() === "") {
      Swal.fire({
        icon: "info",
        title: "검색어를 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    // 쉼표로 검색어 나누기
    const keywords = inputValue.split(",").map((item) => item.trim());

    // Context에 검색어 업데이트
    setSearchQuery(inputValue);

    // 다중 검색 쿼리 생성
    const queryParams = new URLSearchParams({
      food1: keywords[0] || "",
      food2: keywords[1] || "",
      food3: keywords[2] || "",
    });

    // 검색 결과 페이지로 이동
    navigate(`/recipe/list?${queryParams.toString()}`);
  };

  // 엔터 키를 눌렀을 때
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(); // 검색 실행
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // 입력 상태 업데이트
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="search"
        className="searchbar"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress} // 엔터 키 이벤트
      />
      <div onClick={handleSearch} className="search-icon-container">
        <SearchIcon /> {/* 아이콘 클릭 시 검색 실행 */}
      </div>
    </div>
  );
};

export default RecipeSearchBar;
