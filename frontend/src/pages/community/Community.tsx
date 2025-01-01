import SearchBar from "../../components/common/SearchBar";
import "../../styles/community/Community.css";
import CommunityRegisterButton from "../../components/community/CommunityRegisterButton";
import "../../styles/community/CommunityList.css";
import CommunityList from "./CommunityList";

const Community = () => {
  return (
    <div className="community-page">
      <div className="communitybody">
        {/* 배경 컨테이너 추가 */}
        <div className="community-background"></div>
        {/* 실제 컨텐츠 */}
        <div className="community-content">
          <div className="community-toregister-button">
            <CommunityRegisterButton></CommunityRegisterButton>
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
            <SearchBar />
          </div>

          <div className="community-button-group">
            <button className="community-button">전체</button>
            <button className="community-button">교환</button>
            <button className="community-button">나눔</button>
          </div>

          {/*  */}
          <CommunityList />
        </div>
      </div>
    </div>
  );
};

export default Community;
