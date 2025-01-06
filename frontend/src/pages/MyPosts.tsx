import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/MyPosts.css";

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
  postContent: string;
  userEmail: string;
}

const MyPosts = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [posts, setPosts] = useState<PostSimpleDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${apiUrl}/api/posts`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
          },
        });

        const currentUserEmail = localStorage.getItem("userEmail")
        const myPosts = response.data.filter(
          (post: PostSimpleDto) =>
            post.userEmail === currentUserEmail
        );
        setPosts(myPosts);
      } catch (err) {
        setError("내 게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="community-list-body">
      <h1>내 게시글</h1>
      {posts.length === 0 ? (
        <div className="no-recipes">
          <h1>현재 등록된 게시글이 없습니다.</h1>
          <Link to="/community/register">
            <h2>게시글 등록하러 가기</h2>
          </Link>
        </div>
      ) :
      (<div className="recipelistbody">
        {posts.map((post) => (
          <div className="recipe-list-container" key={post.postId}>
            <div className="recipe-list-box-name-title">
              [{post.tradeType === "EXCHANGE" ? "교환" : "나눔"}]
            </div>
            <div className="recipe-list-box-card">
              <div className="recipe-list-box-card-img-container">
                {post.postPhoto1 ? (
                  <Link to={`/community/detail/${post.postId}`}>
                  <img
                    className="recipe-list-box-card-img"
                    src={post.postPhoto1}
                    alt={post.postTitle}
                  />
                  </Link>
                ) : (
                  <p>이미지가 없습니다.</p>
                )}
              </div>
              <div className="recipe-list-box-card-title">{post.postTitle}</div>
              <div className="recipe-list-box-card-detail">
                {post.userProfile ? (
                    <img
                      className="recipe-list-box-card-profile-img"
                      src={post.userProfile}
                    />
                  ) : (
                    <p>프로필 이미지 없음</p>
                  )}{post.userNickname}
              </div>
              <div className="recipe-list-box-card-detail">
                작성일 : {" "}
                {new Date(post.postCreatedDate).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
              <div className="recipe-list-box-card-more">
                <Link to={`/community/detail/${post.postId}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}

      </div>)}
    </div>
  );
};

export default MyPosts;
