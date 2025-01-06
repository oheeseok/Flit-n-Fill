import { useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import "../../styles/community/Community.css";
import CommunityRegisterButton from "../../components/community/CommunityRegisterButton";
import "../../styles/community/CommunityList.css";
import CommunityList from "./CommunityList";

const Community = () => {
  const [filter, setFilter] = useState<string>("ALL"); // 상태 관리: 'ALL', 'EXCHANGE', 'SHARING'
  const [query, setQuery] = useState<string>(""); // 검색어 관리
  const [activeButton, setActiveButton] = useState(false);
  // const [searchParams, setSearchParams] = useSearchParams();

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery); // 검색어 업데이트
  };
  const handleClick = () => {
    setFilter(filter); // 필터 상태 업데이트
    setActiveButton(!activeButton); // 현재 클릭된 버튼의 상태 저장
  };

  return (
    <div className="community-page">
      <div className="communitybody">
        {/* 배경 컨테이너 추가 */}
        <div className="community-background"></div>
        {/* 실제 컨텐츠 */}
        <div className="community-content">
          <div className="community-title">exchange & sharing</div>

          <div className="community-searchbar">
            <SearchBar query={query} onQueryChange={handleQueryChange} />
          </div>

          <div className="community-button-group">
            <button
              className={`community-button ${filter === "ALL" ? "active" : ""}`}
              onClick={() => {
                setFilter("ALL");
                handleClick();
              }}
            >
              전체
            </button>
            <button
              className="community-button"
              onClick={() => setFilter("EXCHANGE")}
            >
              교환
            </button>
            <button
              className="community-button"
              onClick={() => setFilter("SHARING")}
            >
              나눔
            </button>
          </div>

          <div className="community-toregister-button">
            <CommunityRegisterButton />
          </div>

          <CommunityList filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default Community;
