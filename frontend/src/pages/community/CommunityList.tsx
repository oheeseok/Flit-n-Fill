import React from "react";
import { Link } from "react-router-dom";
import { communityData } from "../../data/communityData"; // 임시 데이터 가져오기
import "../../styles/community/CommunityList.css";

const CommunityList = () => {
  return (
    <div className="community-list-body">
      <div className="community-list-header">
        <h1>분당구</h1>
      </div>

      <div className="recipelistbody">
        {communityData.map((post, index) => (
          <div className="recipe-list-container" key={index}>
            <div className="recipe-list-box-name-title">
              [{post.tradeType === "EXCHANGE" ? "교환" : "나눔"}]
            </div>
            <div className="recipe-list-box-card">
              <div className="recipe-list-box-card-img-container">
                {post.postPhoto1 ? (
                  <img
                    className="recipe-list-box-card-img"
                    src={post.postPhoto1}
                    alt={post.postTitle}
                  />
                ) : (
                  <p>이미지가 없습니다.</p>
                )}
              </div>
              <div className="recipe-list-box-card-title">{post.postTitle}</div>
              <div className="recipe-list-box-card-detail">
                {post.postContent}
              </div>
              <div className="recipe-list-box-card-detail">
                <strong>장소:</strong> {post.meetingPlace}
              </div>
              <div className="recipe-list-box-card-detail">
                <strong>시간:</strong>{" "}
                {new Date(post.meetingTime).toLocaleString()}
              </div>
              <div className="recipe-list-box-card-more">
                <Link to={`/community/detail/${index}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;
