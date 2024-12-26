import { useRecipe } from "../../context/RecipeContext";
import { useNavigate } from "react-router-dom";
import "../../styles/common/SearchBar.css";
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

    setSearchQuery(inputValue); // Context에 검색어 업데이트
    navigate(`/recipe/list?query=${inputValue}`); // 검색 결과 페이지로 이동
  };
  // 엔터 키를 눌렀을 때
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(); // 검색 실행
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // 입력 상태 업데이트트
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search"
        className="searchbar"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} // 엔터 키 이벤트
      />
      <div onClick={handleSearch} className="search-icon-container">
        <SearchIcon /> {/* 아이콘 클릭 시 검색 실행 */}
      </div>
    </div>
  );
};

export default RecipeSearchBar;
