import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecipe } from "../../context/RecipeContext";

import "../../styles/recipe/RecipeEdit.css";
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

const RecipeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { recipes, setRecipes } = useRecipe();
  const navigate = useNavigate();
  const recipe = recipes[Number(id)];

  if (!recipe) {
    Swal.fire({
      icon: "error",
      title: "레시피를 찾을 수 없습니다.",
      confirmButtonText: "확인",
    }).then(() => navigate("/recipe/list"));
    return null;
  }

  const [recipeTitle, setRecipeTitle] = useState(recipe.recipeTitle);
  const [recipeImage, setRecipeImage] = useState<string | null>(
    recipe.recipeMainPhoto
  );
  const [recipeIngredients, setRecipeIngredients] = useState(
    recipe.recipeFoodDetails
  );
  const [recipeMethods, setRecipeMethods] = useState<RecipeMethod[]>(
    recipe.recipeSteps
  );
  const [recipeIsVisibility, setRecipeIsVisibility] = useState(
    recipe.recipeIsVisibility
  );

  const handleSave = () => {
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

    const updatedRecipes = recipes.map((r, index) =>
      index === Number(id)
        ? {
            ...r,
            recipeTitle,
            recipeMainPhoto: recipeImage,
            recipeFoodDetails: recipeIngredients,
            recipeSteps: recipeMethods,
            recipeIsVisibility,
          }
        : r
    );

    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

    Swal.fire({
      icon: "success",
      title: "레시피가 성공적으로 수정되었습니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate(`/recipe/detail/${id}`);
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
    <div className="recipeeditbody">
      <div className="recipe-edit-title-container">
        <div className="recipe-edit-title">
          <div className="recipe-edit-title-text">Title</div>
          <div className="recipe-edit-isvisibility">
            <input
              type="checkbox"
              className="recipe-edit-isvisibility-checkbox"
              checked={!recipeIsVisibility}
              onChange={(e) => setRecipeIsVisibility(!e.target.checked)}
            />
            비공개
          </div>
          <input
            className="recipe-edit-title-input"
            type="text"
            placeholder="요리 제목을 적어주세요."
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
        <div className="recipe-edit-image">
          <RecipeImageUploader
            uploadedImage={recipeImage}
            onChangeImage={handleImageChange}
            size="large"
          />
        </div>
      </div>
      <div className="recipe-edit-ingredients-container">
        <div className="recipe-edit-ingredients-title">Ingredients</div>
        <div className="recipe-edit-ingredients-textbox">
          <textarea
            className="recipe-edit-ingredients-text"
            placeholder="재료를 입력해 주세요. ex) 계란 10개, 사과10개"
            value={recipeIngredients}
            onChange={(e) => setRecipeIngredients(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="recipe-edit-method-container">
        <div className="recipe-edit-method-title">Recipe Steps</div>
        {recipeMethods.map((method, seq) => (
          <div key={method.seq} className="recipe-edit-method-box">
            <div className="recipe-edit-method-box-num">{method.seq}</div>
            <div className="recipe-edit-method-box-img">
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
              className="recipe-edit-method-box-remove"
              onClick={() => delRecipeMethod(seq)}
            >
              -
            </button>
          </div>
        ))}
        <button
          className="recipe-edit-method-box-add-button"
          onClick={addRecipeMethod}
        >
          +
        </button>
      </div>
      <div className="recipe-edit-to-recipedetail-button-container">
        <RecipeDetailButton onClick={handleSave} />
        <RecipeCancelButton />
      </div>
    </div>
  );
};

export default RecipeEdit;
