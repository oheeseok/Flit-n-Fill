import { useState } from "react";
import SearchBar from "../../components/common/SearchBar";
import "../../styles/community/Community.css";
import CommunityRegisterButton from "../../components/community/CommunityRegisterButton";
import "../../styles/community/CommunityList.css";
import CommunityList from "./CommunityList";

const Community = () => {
  const [filter, setFilter] = useState<string>("ALL"); // 상태 관리: 'ALL', 'EXCHANGE', 'SHARING'
  const [query, setQuery] = useState<string>(""); // 검색어 관리

  // const [searchParams, setSearchParams] = useSearchParams();

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery); // 검색어 업데이트
  };
  // const handleQueryChange = (newQuery: string) => {
  //   const updatedParams = {
  //     ...Object.fromEntries(searchParams.entries()),
  //     searchQuery: newQuery,
  //   };
  //   setSearchParams(updatedParams);
  // };

  // const handleFilterChange = (newFilter: string) => {
  //   const updatedParams = {
  //     ...Object.fromEntries(searchParams.entries()),
  //     tradeType: newFilter,
  //   };
  //   setSearchParams(updatedParams);
  // };

  return (
    <div className="community-page">
      <div className="communitybody">
        {/* 배경 컨테이너 추가 */}
        <div className="community-background"></div>
        {/* 실제 컨텐츠 */}
        <div className="community-content">
          <div className="community-title">exchange & sharing</div>
          {/* <div className="community-address">
            <div className="community-address-si">
              <select className="community-select" aria-label="시/군">
                <option value="">시/군</option>
                <option value="city1">City 1</option>
                <option value="city2">City 2</option>
              </select>
            </div>
            <div className="community-address-gu">
              <select className="community-select" aria-label="구">
                <option value="">구</option>
                <option value="district1">District 1</option>
                <option value="district2">District 2</option>
              </select>
            </div>
          </div> */}
          <div className="community-searchbar">
            <SearchBar query={query} onQueryChange={handleQueryChange} />
          </div>

          <div className="community-button-group">
            <button
              className="community-button"
              onClick={() => setFilter("ALL")}
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
