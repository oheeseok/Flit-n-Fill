// import { useRecipe } from "../../context/RecipeContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/common/SearchBar.css";
import SearchIcon from "./SearchIcon";
import Swal from "sweetalert2";

interface SearchBarProps {
  query: string; // 현재 검색어
  onQueryChange: (newQuery: string) => void; // 검색어 변경 핸들러
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  const navigate = useNavigate();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value); // 검색어 상태 업데이트
  };

  // 검색 실행 함수
  const handleSearch = () => {
    if (query.trim() === "") {
      navigate("/community");
      Swal.fire({
        icon: "info",
        title: "검색어를 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }
    setSearchParams({ searchQuery: query }); // URL query string 업데이트
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="원하시는 재료를 검색하세요"
        className="searchbar"
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 엔터 키 이벤트
      />
      <div onClick={handleSearch} className="search-icon-container">
        <SearchIcon /> {/* 아이콘 클릭 시 검색 실행 */}
      </div>
    </div>
  );
};

export default SearchBar;
