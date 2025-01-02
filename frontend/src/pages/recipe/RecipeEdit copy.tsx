import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { useRecipe } from "../../context/RecipeContext";
import "../../styles/recipe/RecipeEdit.css";
import RecipeImageUploader from "../../components/recipe/RecipeImageUploader";
import RecipeStepImageUploader from "../../components/recipe/RecipeStepImageUploader";
import RecipeDetailButton from "../../components/recipe/RecipeDetailButton";
import RecipeCancelButton from "../../components/recipe/RecipeCancelButton";
import Swal from "sweetalert2";

interface RecipeMethod {
  seq: number;
  photo: File | null;
  description: string;
}

const RecipeEdit = () => {
  const { id } = useParams<{ id: string }>();
  // const { recipes, setRecipes } = useRecipe();
  const navigate = useNavigate();

  const recipe = recipes.find((r) => r.recipeId === id);

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

  const handleSave = async () => {
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

    try {
      const formData = new FormData();

      const recipeUpdateDto = {
        recipeTitle,
        recipeFoodDetails: recipeIngredients,
        recipeSteps: recipeMethods,
      };

      formData.append("recipeUpdateDto", JSON.stringify(recipeUpdateDto));

      if (recipeImage instanceof File) {
        formData.append("recipeMainPhoto", recipeImage);
      }

      recipeMethods.forEach((method, index) => {
        if (method.photo instanceof File) {
          formData.append(`recipeStepPhotos[${index}]`, method.photo);
        }
      });

      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update recipe: ${response.statusText}`);
      }

      const updatedRecipe = await response.json();

      setRecipes((prev) =>
        prev.map((r) => (r.recipeId === id ? updatedRecipe : r))
      );

      Swal.fire({
        icon: "success",
        title: "레시피가 성공적으로 수정되었습니다.",
        confirmButtonText: "확인",
      }).then(() => navigate(`/recipe/detail/${id}`));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "레시피 수정에 실패했습니다.",
        confirmButtonText: "확인",
      });
      console.error("Error updating recipe:", error);
    }
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

  const handleImageChange = (photo: File | string) => {
    setRecipeImage(photo);
  };

  const handleStepImageChange = (seq: number, photo: File | string): void => {
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
          />
        </div>
      </div>
      <div className="recipe-edit-ingredients-container">
        <div className="recipe-edit-ingredients-title">Ingredients</div>
        <textarea
          className="recipe-edit-ingredients-text"
          placeholder="재료를 입력해 주세요. ex) 계란 10개, 사과10개"
          value={recipeIngredients}
          onChange={(e) => setRecipeIngredients(e.target.value)}
        ></textarea>
      </div>
      <div className="recipe-edit-method-container">
        <div className="recipe-edit-method-title">Recipe Steps</div>
        {recipeMethods.map((method, seq) => (
          <div key={method.seq} className="recipe-edit-method-box">
            <div className="recipe-edit-method-box-num">{method.seq}</div>
            <RecipeStepImageUploader
              stepIndex={seq}
              uploadedImage={method.photo}
              onImageChange={handleStepImageChange}
            />
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
