import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import { communityData } from "../../data/communityData"; // 임시 데이터 가져오기
import "../../styles/community/CommunityList.css";

interface PostSimpleDto {
  postId: number;
  postTitle: string;
  postPhoto1: string;
  tradeType: "SHARING" | "EXCHANGE";
  postCreatedDate: Date;
  userNickname: string;
  userProfile: string;
  address: string;
  progress: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}

const CommunityList = () => {
  const [posts, setPosts] = useState<PostSimpleDto[]>([]); // 상태로 게시글 목록 관리
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지 관리

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts", {
          headers: { withCredentials: true },
        });
        setPosts(response.data); // 응답 데이터를 상태에 저장
      } catch (err) {
        console.error("게시글 목록 가져오기 실패:", err);
        setError("게시글 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="community-list-body">
      <div className="community-list-header">
        {/* 지역이름 */}
        <h1>게시글 목록</h1>  
      </div>

      <div className="recipelistbody">
        {posts.map((post) => (
          <div className="recipe-list-container" key={post.postId}>
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
                {post.userProfile}
              </div>
              <div className="recipe-list-box-card-detail">
                {post.userNickname}
              </div>
              <div className="recipe-list-box-card-detail">
                <strong>작성일:</strong> {post.postCreatedDate.toLocaleString()}
              </div>
              {/* <div className="recipe-list-box-card-detail">
                <strong>시간:</strong>{" "}
                {new Date(post.meetingTime).toLocaleString()}
              </div> */}
              <div className="recipe-list-box-card-more">
                <Link to={`/community/detail/${post.postId}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;
