import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // SweetAlert2 사용
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/MyRecipes.css";

interface RecipeSimpleDto {
  recipeId: string;
  recipeTitle: string;
  recipeMainPhoto: string;
  recipeFoodDetails: string;
  recipeIsVisibility: boolean;
  recipeIsBookmarked: boolean;
  recipeCreatedDate: Date;
  userNickname: string;
  userProfile: string;
}

const MyRecipes = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 관리
  const [recipes, setRecipes] = useState<RecipeSimpleDto[]>([]);
  const [error, setError] = useState<string | null>(null); // 에러 메시지 관리

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${apiUrl}/api/user/my-recipes`, {
          withCredentials: true,
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"), 
          },
        });
        console.log("response.data: ", response.data)
        setRecipes(response.data); // 응답 데이터를 상태에 저장
      } catch (err) {
        console.error("레시피 목록 가져오기 실패:", err);
        Swal.fire({
          icon: "error",
          title: "레시피 정보 가져오기 중 오류가 발생했습니다.",
          text: "레시피 목록으로 이동합니다.",
          confirmButtonText: "확인",
        })
        setError("레시피 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {recipes.length === 0 ? (
        <div className="no-recipes">
          <h1>현재 등록된 레시피가 없습니다.</h1>
          <Link to="/recipe/register">
            <h2>레시피 등록하러 가기</h2>
          </Link>
        </div>
      ) :  (
      <div className="recipelistbody">
        {recipes.map((recipe) => (
          <div className="recipe-list-container" key={recipe.recipeId}>
            <div className="recipe-list-box-name-title">
              {recipe.userNickname}의 {recipe.recipeTitle}
            </div>
            <div className="recipe-list-box-card">
              <div className="recipe-list-box-card-img-container">
                <Link to={`/recipe/detail/${recipe.recipeId}`}>
                <img
                  className="recipe-list-box-card-img"
                  src={recipe.recipeMainPhoto || "/placeholder.jpg"}
                  alt={recipe.recipeTitle}
                />
                </Link>
              </div>
              <div className="recipe-list-box-card-profile-container">
                <div
                  className="recipe-list-box-card-profile-container-img"
                  style={{
                    backgroundImage: `url(${
                      recipe.userProfile || "/placeholder.jpg"
                    })`,
                    backgroundSize: "cover",
                    borderRadius: "36px",
                    width: "42px",
                    height: "42px",
                  }}
                ></div>
                <div className="recipe-list-box-card-profile-container-name">
                  {recipe.userNickname || "Unknown User"}
                </div>
              </div>
              <div className="recipe-list-box-card-title">
                {recipe.recipeTitle}
              </div>
              <div className="recipe-list-box-card-detail">
                {recipe.recipeFoodDetails.slice(0, 30)}...
              </div>
              <div className="recipe-list-box-card-more">
                <Link to={`/recipe/detail/${recipe.recipeId}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}
      </div>)}
    </>
  )
}

export default MyRecipes;