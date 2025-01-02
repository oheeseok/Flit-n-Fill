import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../../components/common/SearchBar";
import "../../styles/community/Community.css";
import CommunityRegisterButton from "../../components/community/CommunityRegisterButton";
import "../../styles/community/CommunityList.css";
import CommunityList from "./CommunityList";

const Community = () => {
  const [filter, setFilter] = useState<string>("ALL")   // 상태 관리: 'ALL', 'EXCHANGE', 'SHARING'
  const [query, setQuery] = useState<string>("")  // 검색어 관리
  // const [posts, setPosts] = useState([])

  // const handleFilterChange = (type: string) => {
  //   setFilter(type);
  // };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery); // 검색어 업데이트
  };

  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get("/api/posts", {
  //       params: { "search-query": query },
  //       withCredentials: true,
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         userEmail: localStorage.getItem("userEmail"),
  //       },
  //     });
  //     setPosts(response.data); // 검색 결과로 상태 업데이트
  //   } catch (error) {
  //     console.error("검색 요청 실패:", error);
  //     alert("검색 중 오류가 발생했습니다.");
  //   }
  // };

  // useEffect(() => {
  //   // 기본 게시글 가져오기
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get("/api/posts", {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           userEmail: localStorage.getItem("userEmail"),
  //         },
  //       });
  //       setPosts(response.data);
  //     } catch (error) {
  //       console.error("게시글 목록 가져오기 실패:", error);
  //       alert("게시글 목록을 가져오는 중 오류가 발생했습니다.");
  //     }
  //   };

  //   fetchPosts();
  // }, []);


  return (
    <div className="community-page">
      <div className="communitybody">
        {/* 배경 컨테이너 추가 */}
        <div className="community-background"></div>
        {/* 실제 컨텐츠 */}
        <div className="community-content">
          <div className="community-toregister-button">
            <CommunityRegisterButton />
          </div>
          <div className="community-title">exchange & sharing</div>
          <div className="community-address">
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
          </div>
          <div className="community-searchbar">
            <SearchBar query={query} onQueryChange={handleQueryChange}/>
          </div>

          <div className="community-button-group">
            <button className="community-button"
            onClick={() => setFilter("ALL")}
            >
              전체
            </button>
            <button className="community-button"
              onClick={() => setFilter("EXCHANGE")}
            >
              교환
            </button>
            <button className="community-button"
              onClick={() => setFilter("SHARING")}
            >
              나눔
            </button>
          </div>

          {/*  */}
          <CommunityList filter={filter}/>
        </div>
      </div>
    </div>
  );
};

export default Community;
