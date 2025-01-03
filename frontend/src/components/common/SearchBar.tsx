// import { useRecipe } from "../../context/RecipeContext";
import { useSearchParams } from "react-router-dom";
import "../../styles/common/SearchBar.css";
import SearchIcon from "./SearchIcon";
import Swal from "sweetalert2";

interface SearchBarProps {
  query: string; // 현재 검색어
  // tradeType: string; // 현재 tradeType 필터
  onQueryChange: (newQuery: string) => void; // 검색어 변경 핸들러
  // onSearch: () => void; // 검색 실행 핸들러
  // onTradeTypeChange: (newTradeType: string) => void; // 필터 변경 핸들러
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => {
  // const { setSearchQuery } = useRecipe(); // Context에서 setSearchQuery만 사용
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  console.log(searchParams)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value); // 검색어 상태 업데이트
  };

  // const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newTradeType = event.target.value;
  //   // onTradeTypeChange(newTradeType); // tradeType 상태 업데이트
  //   setSearchParams({ searchQuery: query, tradeType: newTradeType }); // URL query string 업데이트
  // };

  // 엔터 키를 눌렀을 때
  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === "Enter" && query.trim() === "") {
  //     // Swal.fire({
  //     //   icon: "info",
  //     //   title: "검색어를 입력해주세요.",
  //     //   confirmButtonText: "확인",
  //     // });
  //     // return;
  //     handleSearch()
  //   }
  //   // navigate(`/community/list?query=${query}`); // 검색 결과 페이지로 이동
  // };

  // 검색 실행 함수
  const handleSearch = () => {
    if (query.trim() === "") {
      Swal.fire({
        icon: "info",
        title: "검색어를 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }
    // navigate(`/community/list?query=${query}`); // 검색 결과 페이지로 이동 
    // onSearch()
    setSearchParams({ searchQuery: query }); // URL query string 업데이트
    // 기존 query string 유지하면서 searchQuery와 tradeType 업데이트
    // const updatedParams = {
    //   ...Object.fromEntries(searchParams.entries()),
    //   searchQuery: query,
    // };
    // onSearch(); // URL query string 업데이트
  };


  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search"
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
