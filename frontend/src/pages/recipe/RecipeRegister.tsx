import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useRecipe } from "../../context/RecipeContext";
import "../../styles/recipe/RecipeRegister.css";
import RecipeImageUploader from "../../components/recipe/RecipeImageUploader";
import RecipeStepImageUploader from "../../components/recipe/RecipeStepImageUploader";
import RecipeDetailButton from "../../components/recipe/RecipeDetailButton";
import RecipeCancelButton from "../../components/recipe/RecipeCancelButton";
import Swal from "sweetalert2";
import axios from "axios";

// 레시피 단계의 타입 정의
interface RecipeStepDto {
  seq: number;
  photo: File | null; // 파일 객체 처리
  description: string;
}

const RecipeRegister = () => {
  const navigate = useNavigate();
  // const { addRecipe } = useRecipe();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeImage, setRecipeImage] = useState<File | null>(null); // 메인 이미지 파일
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeMethods, setRecipeMethods] = useState<RecipeStepDto[]>([
    { seq: 1, photo: null, description: "" },
  ]);
  const [recipeIsVisibility, setRecipeIsVisibility] = useState(true);

  const handleRegister = async () => {
    if (!recipeTitle.trim()) {
      Swal.fire({
        icon: "info",
        title: "제목을 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    if (!recipeImage) {
      Swal.fire({
        icon: "info",
        title: "대표 이미지를 업로드해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      const formData = new FormData();

      // 레시피 데이터를 JSON으로 변환
      const recipeRegisterDto = {
        recipeTitle,
        recipeFoodDetails: recipeIngredients,
        recipeSteps: recipeMethods.map((method) => ({
          seq: method.seq,
          description: method.description,
        })),
        recipeIsVisibility,
      };

      // JSON 데이터 추가
      formData.append("recipeRegisterDto", JSON.stringify(recipeRegisterDto));

      // 메인 이미지 추가
      if (recipeImage instanceof File) {
        formData.append("recipeMainPhoto", recipeImage);
      }

      // 단계별 이미지 추가
      recipeMethods.forEach((method) => {
        // if (method.photo instanceof File) {
        //   formData.append(`recipeStepPhotos`, method.photo);
        // }
        if (method.photo) {
          // 이미지가 있으면 파일을 첨부
          formData.append("recipeStepPhotos", method.photo);
        } else {
          // 이미지가 없으면 null로 전송
          formData.append(
            "recipeStepPhotos",
            new Blob([], { type: "application/json" })
          );
        }
      });

      // API 요청
      const response = await axios.post("/api/recipes", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true, // 쿠키 포함 설정
      });

      // if (!response.ok) {
      //   const errorText = await response.text();
      //   throw new Error(`Failed to register recipe: ${errorText}`);
      // }

      const newRecipe = response.data;
      Swal.fire({
        icon: "success",
        title: "레시피가 성공적으로 등록되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        navigate(`/recipe/detail/${newRecipe.recipeId}`);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "레시피 등록에 실패했습니다.",
        confirmButtonText: "확인",
      });
      console.error("Error registering recipe:", error);
    }
  };

  // 레시피 단계 추가
  const addRecipeMethod = () => {
    setRecipeMethods((prev) => [
      ...prev,
      { seq: prev.length + 1, photo: null, description: "" },
    ]);
  };

  // 레시피 단계 삭제
  const delRecipeMethod = (index: number) => {
    setRecipeMethods((prevMethods) =>
      prevMethods
        .filter((_, i) => i !== index)
        .map((method, idx) => ({ ...method, seq: idx + 1 }))
    );
  };

  // 대표 이미지 처리
  const handleImageChange = (file: File | null) => {
    setRecipeImage(file);
  };

  // 각 단계별 이미지 처리
  const handleStepImageChange = (seq: number, file: File | null): void => {
    setRecipeMethods((prevMethods) =>
      prevMethods.map((method, i) =>
        i === seq ? { ...method, photo: file } : method
      )
    );
  };

  // 각 단계 설명 처리
  const handleDescriptionChange = (
    seq: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRecipeMethods((prevMethods) =>
      prevMethods.map((method, i) =>
        i === seq ? { ...method, description: event.target.value } : method
      )
    );
  };

  return (
    <div className="reciperegisterbody">
      <div className="recipe-register-title-container">
        <div className="recipe-register-title">
          <div className="recipe-register-title-text">Title</div>
          <div className="recipe-register-isvisibility">
            <input
              type="checkbox"
              className="recipe-register-isvisibility-checkbox"
              checked={!recipeIsVisibility}
              onChange={(e) => setRecipeIsVisibility(!e.target.checked)}
            />
            비공개
          </div>
          <input
            className="recipe-register-title-input"
            type="text"
            placeholder="요리 제목을 적어주세요."
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
        <div className="recipe-register-image">
          <RecipeImageUploader
            uploadedImage={
              recipeImage ? URL.createObjectURL(recipeImage) : null
            }
            onChangeImage={handleImageChange}
          />
        </div>
      </div>
      <div className="recipe-register-ingredients-container">
        <div className="recipe-register-ingredients-title">Ingredients</div>
        <textarea
          className="recipe-register-ingredients-textbox"
          placeholder="재료를 입력해 주세요."
          value={recipeIngredients}
          onChange={(e) => setRecipeIngredients(e.target.value)}
        ></textarea>
      </div>
      <div className="recipe-register-method-container">
        <div className="recipe-register-method-title">Recipe Steps</div>
        {recipeMethods.map((method, seq) => (
          <div key={method.seq} className="recipe-register-method-box">
            <div className="recipe-register-method-box-num">{method.seq}</div>
            <div className="recipe-register-method-box-img">
              <RecipeStepImageUploader
                stepIndex={seq}
                uploadedImage={
                  method.photo ? URL.createObjectURL(method.photo) : null
                }
                onImageChange={handleStepImageChange}
              />
            </div>
            <textarea
              value={method.description}
              onChange={(e) => handleDescriptionChange(seq, e)}
              placeholder="조리 방법을 입력해 주세요."
            ></textarea>
            <button
              className="recipe-register-method-box-remove"
              onClick={() => delRecipeMethod(seq)}
            >
              -
            </button>
          </div>
        ))}
        <button
          className="recipe-register-method-box-add-button"
          onClick={addRecipeMethod}
        >
          +
        </button>
      </div>
      <div className="recipe-register-to-recipedetail-button-container">
        <RecipeDetailButton onClick={handleRegister} label="등록하기" />
        <RecipeCancelButton />
      </div>
    </div>
  );
};

export default RecipeRegister;
