import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../context/RecipeContext";

import "../../styles/recipe/RecipeRegister.css";
import RecipeImageUploader from "../../components/recipe/RecipeImageUploader";
import RecipeStepImageUploader from "../../components/recipe/RecipeStepImageUploader";
import RecipeDetailButton from "../../components/recipe/RecipeDetailButton";
import RecipeCancelButton from "../../components/recipe/RecipeCancelButton";
import Swal from "sweetalert2";

interface RecipeMethod {
  seq: number;
  photo: string;
  description: string;
}

const RecipeRegister = () => {
  const navigate = useNavigate();
  const { addRecipe } = useRecipe();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeMethods, setRecipeMethods] = useState<RecipeMethod[]>([
    { seq: 1, photo: "", description: "" },
  ]);
  const [recipeIsVisibility, setRecipeIsVisibility] = useState(true);

  const handleRegister = () => {
    // 입력값 유효성 검사
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
    if (!recipeIngredients.trim()) {
      Swal.fire({
        icon: "info",
        title: "재료를 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }
    for (let step of recipeMethods) {
      if (!step.description.trim()) {
        Swal.fire({
          icon: "info",
          title: `레시피를 입력해주세요.`,
          confirmButtonText: "확인",
        });
        return;
      }
    }

    const newRecipeIndex = addRecipe({
      recipeTitle: recipeTitle,
      recipeMainPhoto: recipeImage,
      recipeFoodDetails: recipeIngredients,
      recipeSteps: recipeMethods,
      recipeIsVisibility, // 공개/비공개 상태 추가
    });

    // 새로 추가된 레시피의 인덱스에 따라 경로 이동
    Swal.fire({
      icon: "success",
      title: "레시피가 성공적으로 등록되었습니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate(`/recipe/detail/${newRecipeIndex}`);
    });
  };

  const addRecipeMethod = () => {
    setRecipeMethods((prev) => [
      ...prev,
      { seq: prev.length + 1, photo: "", description: "" },
    ]);
  };

  const delRecipeMethod = (index: number) => {
    setRecipeMethods((prevMethods) =>
      prevMethods
        .filter((_, i) => i !== index)
        .map((method, idx) => ({ ...method, seq: idx + 1 }))
    );
  };

  const handleImageChange = (photo: string) => {
    setRecipeImage(photo);
  };

  const handleStepImageChange = (seq: number, photo: string): void => {
    setRecipeMethods((prevMethods) =>
      prevMethods.map((method, i) =>
        i === seq ? { ...method, photo } : method
      )
    );
  };

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
              checked={!recipeIsVisibility} // 비공개 체크
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
            uploadedImage={recipeImage}
            onChangeImage={handleImageChange}
            size="large"
          />
        </div>
      </div>
      <div className="recipe-register-ingredients-container">
        <div className="recipe-register-ingredients-title">Ingredients</div>
        <div className="recipe-register-ingredients-textbox">
          <textarea
            className="recipe-register-ingredients-text"
            placeholder="재료를 입력해 주세요. ex) 계란 10개, 사과10개"
            value={recipeIngredients}
            onChange={(e) => setRecipeIngredients(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="recipe-register-method-container">
        <div className="recipe-register-method-title">Recipe Steps</div>
        {recipeMethods.map((method, seq) => (
          <div key={method.seq} className="recipe-register-method-box">
            <div className="recipe-register-method-box-num">{method.seq}</div>
            <div className="recipe-register-method-box-img">
              <RecipeStepImageUploader
                stepIndex={seq}
                uploadedImage={method.photo}
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
        <RecipeDetailButton onClick={handleRegister} />
        <RecipeCancelButton />
      </div>
    </div>
  );
};

export default RecipeRegister;