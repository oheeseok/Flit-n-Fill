import { useRecipe } from "../../context/RecipeContext";
import { Link } from "react-router-dom";
import SearchBar from "../../components/common/SearchBar";
import "../../styles/recipe/RecipeList.css";

const RecipeList = () => {
  const { recipes, searchQuery } = useRecipe();

  // 검색어를 기준으로 레시피 필터링
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.recipeFoodDetails.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="recipe-list-searchbar-container">
        <SearchBar></SearchBar>
      </div>
      <div className="recipelistbody">
        <div className="recipe-list-option-container"></div>
        {filteredRecipes.map((recipe, index) => (
          <div className="recipe-list-container">
            <div className="recipe-list-box-name-title">
              {/* 여기에 닉네임 의 타이틀 임. */}
              {recipe.recipeTitle}
            </div>
            <div className="recipe-list-box-card">
              <div className="recipe-list-box-card-img-container">
                <img
                  className="recipe-list-box-card-img"
                  src={recipe.recipeMainPhoto || "/placeholder.jpg"}
                  alt={recipe.recipeTitle}
                />
              </div>
              {/* 여기에 프로필 관련 데이터 들어감 프로필 이미지, 닉네임*/}
              <div className="recipe-list-box-card-profile-container">
                <div className="recipe-list-box-card-profile-container-img">
                  img
                </div>
                <div className="recipe-list-box-card-profile-container-name">
                  name
                </div>
                {/* 여기에 이제 즐찾 표시 해야함. 비어있는 별 준비해야함 */}
                <div className="recipe-list-box-card-profile-container-star">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M17.0126 1.8075L20.3776 9.4825C20.5042 9.7713 20.706 10.0208 20.9619 10.2051C21.2179 10.3893 21.5185 10.5015 21.8326 10.53L30.0301 11.265C30.9576 11.4 31.3276 12.5375 30.6551 13.1925L24.4801 18.38C23.9801 18.8 23.7526 19.46 23.8901 20.0975L25.6851 28.5C25.8426 29.4225 24.8751 30.1275 24.0451 29.69L16.8901 25.5C16.6203 25.3415 16.313 25.258 16.0001 25.258C15.6872 25.258 15.3799 25.3415 15.1101 25.5L7.95508 29.6875C7.12758 30.1225 6.15758 29.42 6.31508 28.4975L8.11008 20.095C8.24508 19.4575 8.02008 18.7975 7.52008 18.3775L1.34258 13.195C0.672584 12.5425 1.04258 11.4025 1.96758 11.2675L10.1651 10.5325C10.4791 10.504 10.7798 10.3918 11.0357 10.2076C11.2916 10.0233 11.4934 9.7738 11.6201 9.485L14.9851 1.81C15.4026 0.97 16.5976 0.97 17.0126 1.8075Z"
                      fill="#FDD835"
                    />
                    <path
                      d="M16.7676 9.94262L16.1976 4.28762C16.1751 3.97262 16.1101 3.43262 16.6151 3.43262C17.0151 3.43262 17.2326 4.26512 17.2326 4.26512L18.9426 8.80512C19.5876 10.5326 19.3226 11.1251 18.7001 11.4751C17.9851 11.8751 16.9301 11.5626 16.7676 9.94262Z"
                      fill="#FFFF8D"
                    />
                    <path
                      d="M23.8201 17.8772L28.7251 14.0497C28.9676 13.8472 29.4051 13.5247 29.0551 13.1572C28.7776 12.8672 28.0276 13.2847 28.0276 13.2847L23.7351 14.9622C22.4551 15.4047 21.6051 16.0597 21.5301 16.8847C21.4326 17.9847 22.4201 18.8322 23.8201 17.8772Z"
                      fill="#F4B400"
                    />
                    <path
                      d="M19.9197 9.6833L19.9197 9.68327L16.56 2.02048C16.3269 1.56728 15.6745 1.56398 15.4375 2.02326L12.078 9.68577L12.078 9.68579C11.9154 10.0565 11.6564 10.3768 11.3279 10.6134C10.9993 10.8499 10.6134 10.9939 10.2102 11.0305L10.2097 11.0305L2.02797 11.7641C1.52687 11.8463 1.32539 12.4633 1.6801 12.8255L7.84144 17.9944L7.84168 17.9946C8.48395 18.5342 8.77225 19.3816 8.59924 20.1986L8.59905 20.1995L6.80651 28.5904C6.727 29.0962 7.25667 29.4813 7.71371 29.2494L14.8569 25.0689C14.857 25.0688 14.8571 25.0687 14.8572 25.0687C15.2037 24.8652 15.5983 24.758 16.0001 24.758C16.4018 24.758 16.7963 24.8652 17.1427 25.0685L19.9197 9.6833ZM19.9197 9.6833C20.0822 10.054 20.3413 10.3743 20.6698 10.6109C20.9983 10.8474 21.3843 10.9914 21.7874 11.028L21.7879 11.028M19.9197 9.6833L21.7879 11.028M21.7879 11.028L29.9698 11.7616M21.7879 11.028L29.9698 11.7616M29.9698 11.7616C30.4734 11.8439 30.6748 12.4586 30.3175 12.8231L24.1585 17.9971C23.5176 18.5355 23.2248 19.3826 23.4011 20.202L29.9698 11.7616ZM24.2868 29.2521L17.1433 25.0689L23.4013 20.2029L25.1937 28.593C25.2736 29.1009 24.7442 29.485 24.2868 29.2521Z"
                      stroke="#FDD835"
                    />
                  </svg>
                </div>
              </div>
              <div className="recipe-list-box-card-title">
                {recipe.recipeTitle}
              </div>
              <div className="recipe-list-box-card-detail">
                {recipe.recipeFoodDetails}
              </div>
              <div className="recipe-list-box-card-more">
                <Link to={`/recipe/detail/${index}`}>Read more</Link>
              </div>
            </div>
          </div>
        ))}
        {/* {recipes.map((recipe, index) => (
          <div key={index} className="recipe-item">
            <div>{recipe.recipeTitle}</div>

            <img
              src={recipe.recipeMainPhoto || "/placeholder.jpg"}
              alt={recipe.recipeTitle}
            />

            <div>{recipe.recipeFoodDetails}</div>

            <Link to={`/recipe/detail/${index}`}>View Details</Link>
          </div>
        ))} */}
      </div>
    </>
  );
};
export default RecipeList;
