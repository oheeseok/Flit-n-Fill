import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/recipe/RecipeEdit.css";
import RecipeImageUploader from "../../components/recipe/RecipeImageUploader";
import RecipeStepImageUploader from "../../components/recipe/RecipeStepImageUploader";
import RecipeDetailButton from "../../components/recipe/RecipeDetailButton";
import RecipeCancelButton from "../../components/recipe/RecipeCancelButton";
import Swal from "sweetalert2";
import axios from "axios";

interface RecipeStepDto {
  seq: number;
  photo: File | string | null; // 파일 또는 URL 처리
  description: string;
}

const RecipeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeImage, setRecipeImage] = useState<File | string | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeMethods, setRecipeMethods] = useState<RecipeStepDto[]>([]);
  const [recipeIsVisibility, setRecipeIsVisibility] = useState(true);

  const fetchRecipeDetail = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
        withCredentials: true,
      });
      const recipe = response.data;

      setRecipeTitle(recipe.recipeTitle);
      setRecipeImage(recipe.recipeMainPhoto);
      setRecipeIngredients(recipe.recipeFoodDetails);

      const steps = recipe.recipeSteps.map((step: any, index: number) => ({
        seq: index + 1,
        photo:
          step.photo ||
          "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png",
        description: step.description,
      }));

      setRecipeMethods(steps);
      setRecipeIsVisibility(recipe.recipeIsVisibility);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "레시피를 불러오는데 실패했습니다.",
        confirmButtonText: "확인",
      }).then(() => navigate("/recipe/list"));
    }
  };

  React.useEffect(() => {
    fetchRecipeDetail();
  }, [id]);

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
        title: "메인 이미지를 추가해주세요.",
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

    const missingSteps = recipeMethods.some(
      (method) => !method.description.trim()
    );

    if (missingSteps) {
      Swal.fire({
        icon: "info",
        title: "모든 스텝의 설명을 입력해주세요.",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      const formData = new FormData();

      const recipeUpdateDto = {
        recipeTitle,
        recipeFoodDetails: recipeIngredients,
        recipeSteps: recipeMethods.map((method) => {
          if (method.photo instanceof File) {
            return {
              seq: method.seq,
              description: method.description,
              photo: "",
            };
          } else {
            return {
              seq: method.seq,
              description: method.description,
              photo: method.photo || "",
            };
          }
        }),
      };

      formData.append("recipeUpdateDto", JSON.stringify(recipeUpdateDto));

      if (recipeImage instanceof File) {
        formData.append("recipeMainPhoto", recipeImage);
      }

      recipeMethods
        .filter((method) => method.photo instanceof File)
        .forEach((method) => {
          formData.append("recipeStepPhotos", method.photo as File);
        });

      const existingStepPhotos = recipeMethods
        .filter((method) => typeof method.photo === "string")
        .map((method) => method.photo);

      formData.append("existingStepPhotos", JSON.stringify(existingStepPhotos));

      const response = await axios.put(`/api/recipes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "레시피가 성공적으로 수정되었습니다.",
          confirmButtonText: "확인",
        }).then(() => navigate(`/recipe/detail/${id}`));
      } else {
        throw new Error("Failed to update recipe");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "레시피 수정에 실패했습니다.",
        confirmButtonText: "확인",
      });
      console.error("Error updating recipe:", error);
    }
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
            uploadedImage={
              recipeImage instanceof File
                ? URL.createObjectURL(recipeImage)
                : recipeImage
            }
            onChangeImage={(file) => setRecipeImage(file)}
          />
        </div>
      </div>
      <div className="recipe-edit-ingredients-container">
        <div className="recipe-edit-ingredients-title">Ingredients</div>
        <textarea
          className="recipe-edit-ingredients-textbox"
          placeholder="재료를 입력해 주세요."
          value={recipeIngredients}
          onChange={(e) => setRecipeIngredients(e.target.value)}
        ></textarea>
      </div>
      <div className="recipe-edit-method-container">
        <div className="recipe-edit-method-title">Recipe Steps</div>
        {recipeMethods.map((method, seq) => (
          <div key={method.seq} className="recipe-edit-method-box">
            <div className="recipe-edit-method-box-num">{method.seq}</div>
            <div className="recipe-edit-method-box-img">
              <RecipeStepImageUploader
                stepIndex={seq}
                uploadedImage={
                  method.photo instanceof File
                    ? URL.createObjectURL(method.photo)
                    : method.photo
                }
                onImageChange={(file) =>
                  setRecipeMethods((prevMethods) =>
                    prevMethods.map((m, i) =>
                      i === seq
                        ? {
                            ...m,
                            photo: file as unknown as File | string | null,
                          }
                        : m
                    )
                  )
                }
              />
            </div>
            <textarea
              value={method.description}
              onChange={(e) =>
                setRecipeMethods((prevMethods) =>
                  prevMethods.map((m, i) =>
                    i === seq ? { ...m, description: e.target.value } : m
                  )
                )
              }
              placeholder="조리 방법을 입력해 주세요."
            ></textarea>
            <button
              className="recipe-edit-method-box-remove"
              onClick={() =>
                setRecipeMethods((prevMethods) =>
                  prevMethods
                    .filter((_, i) => i !== seq)
                    .map((m, i) => ({ ...m, seq: i + 1 }))
                )
              }
            >
              -
            </button>
          </div>
        ))}
        <button
          className="recipe-edit-method-box-add-button"
          onClick={() =>
            setRecipeMethods((prev) => [
              ...prev,
              { seq: prev.length + 1, photo: null, description: "" },
            ])
          }
        >
          +
        </button>
      </div>
      <div className="recipe-edit-to-recipedetail-button-container">
        <RecipeDetailButton onClick={handleSave} label="수정하기" />
        <RecipeCancelButton />
      </div>
    </div>
  );
};

export default RecipeEdit;
