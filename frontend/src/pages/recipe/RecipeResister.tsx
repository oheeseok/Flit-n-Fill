import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../context/RecipeContext";

import "../../styles/recipe/RecipeResister.css";
import RecipeImageUploader from "../../components/recipe/RecipeImageUploader";
import RecipeStepImageUploader from "../../components/recipe/RecipeStepImageUploader";
import RecipeDetailButton from "../../components/recipe/RecipeDetailButton";
import RecipeCancelButton from "../../components/recipe/RecipeCancelButton";

interface RecipeMethod {
  seq: number;
  photo: string;
  description: string;
}

const RecipeResister = () => {
  const navigate = useNavigate();
  const { addRecipe } = useRecipe();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeMethods, setRecipeMethods] = useState<RecipeMethod[]>([
    { seq: 1, photo: "", description: "" },
  ]);

  const handleRegister = () => {
    const newRecipeIndex = addRecipe({
      recipeTitle: recipeTitle,
      recipeMainPhoto: recipeImage,
      recipeFoodDetails: recipeIngredients,
      recipeSteps: recipeMethods,
    });

    // 새로 추가된 레시피의 인덱스에 따라 경로 이동
    navigate(`/recipe/detail/${newRecipeIndex}`);
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
    <div className="reciperesisterbody">
      <div className="recipe-resister-title-container">
        <div className="recipe-resister-title">
          Title
          <input
            className="recipe-resister-title-input"
            type="text"
            placeholder="요리 제목을 적어주세요."
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
        <div className="recipe-resister-image">
          <RecipeImageUploader
            uploadedImage={recipeImage}
            onChangeImage={handleImageChange}
            size="large"
          />
        </div>
      </div>
      <div className="recipe-resister-ingredients-container">
        <div className="recipe-resister-ingredients-title">Ingredients</div>
        <div className="recipe-resister-ingredients-textbox">
          <textarea
            className="recipe-resister-ingredients-text"
            placeholder="재료를 입력해 주세요. ex) 계란 10개, 사과10개"
            value={recipeIngredients}
            onChange={(e) => setRecipeIngredients(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="recipe-resister-method-container">
        <div className="recipe-resister-method-title">Recipe Steps</div>
        {recipeMethods.map((method, seq) => (
          <div key={method.seq} className="recipe-resister-method-box">
            <div className="recipe-resister-method-box-num">{method.seq}</div>
            <div className="recipe-resister-method-box-img">
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
              className="recipe-resister-method-box-remove"
              onClick={() => delRecipeMethod(seq)}
            >
              -
            </button>
          </div>
        ))}
        <button
          className="recipe-resister-method-box-add-button"
          onClick={addRecipeMethod}
        >
          +
        </button>
      </div>
      <div className="recipe-resister-to-recipedetail-button-container">
        <RecipeDetailButton onClick={handleRegister} />
        <RecipeCancelButton />
      </div>
    </div>
  );
};

export default RecipeResister;
