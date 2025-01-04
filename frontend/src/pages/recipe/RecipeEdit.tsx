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
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeImage, setRecipeImage] = useState<File | string | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeMethods, setRecipeMethods] = useState<RecipeStepDto[]>([]);
  const [recipeIsVisibility, setRecipeIsVisibility] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);

  const fetchRecipeDetail = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/recipes/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });
      const recipe = response.data;

      setRecipeTitle(recipe.recipeTitle);
      setRecipeImage(recipe.recipeMainPhoto);
      setRecipeIngredients(recipe.recipeFoodDetails);

      const steps = recipe.recipeSteps.map((step: any, index: number) => ({
        seq: index + 1,
        photo:
          step.photo ||
          "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png", // 기본 이미지
        description: step.description,
      }));

      setRecipeMethods(steps);

      console.log(
        "Loaded Step Photos:",
        steps.map((step: RecipeStepDto) => step.photo)
      );

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

      // 레시피 데이터 생성
      const recipeUpdateDto = {
        recipeTitle,
        recipeFoodDetails: recipeIngredients,
        recipeSteps: recipeMethods.map((method) => {
          // 스텝 이미지가 파일이 아니면 기존 이미지 URL을 사용
          if (method.photo instanceof File) {
            return {
              seq: method.seq,
              description: method.description,
              photo: "", // 업로드된 파일은 FormData에서 처리
            };
          } else if (typeof method.photo === "string" && method.photo) {
            // 이미지 URL이 있으면 그대로 사용
            return {
              seq: method.seq,
              description: method.description,
              photo: method.photo,
            };
          } else if (method.photo === null) {
            // 스텝 이미지가 null인 경우 기본 이미지 URL로 설정
            return {
              seq: method.seq,
              description: method.description,
              photo:
                "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png",
            };
          }
          // 이미지가 없으면 기본 이미지 URL로 설정
          return {
            seq: method.seq,
            description: method.description,
            photo:
              "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png",
          };
        }),
      };

      formData.append("recipeUpdateDto", JSON.stringify(recipeUpdateDto));

      // 메인 이미지 파일 추가
      if (recipeImage instanceof File) {
        formData.append("recipeMainPhoto", recipeImage);
      }

      // 새로 추가된 스텝 이미지를 FormData에 추가
      const stepPhotos = recipeMethods
        .filter((method) => method.photo instanceof File)
        .map((method) => method.photo as File);

      stepPhotos.forEach((photo) => {
        formData.append("recipeStepPhotos", photo);
      });

      // 기존 스텝 이미지를 유지할 데이터도 명시적으로 추가
      const existingStepPhotos = recipeMethods
        .filter((method) => typeof method.photo === "string")
        .map(
          (method) =>
            method.photo ||
            "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png"
        );

      formData.append("existingStepPhotos", JSON.stringify(existingStepPhotos));

      console.log("FormData Debug:", {
        recipeUpdateDto,
        existingStepPhotos,
        stepPhotos,
      });

      // 서버에 PUT 요청 (axios 사용)
      const response = await axios.put(`${apiUrl}/api/recipes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
          // "Content-Type" 제거: axios는 자동으로 처리함
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "레시피가 성공적으로 수정되었습니다.",
          confirmButtonText: "확인",
        }).then(() => navigate(`/recipe/detail/${id}`));
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

  const addRecipeMethod = () => {
    setRecipeMethods((prev) => [
      ...prev,
      {
        seq: prev.length + 1,
        photo:
          "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png", // 디폴트 이미지 설정
        description: "",
      },
    ]);
  };

  const delRecipeMethod = (index: number) => {
    setRecipeMethods((prevMethods) =>
      prevMethods
        .filter((_, i) => i !== index)
        .map((method, idx) => ({ ...method, seq: idx + 1 }))
    );
  };

  const handleImageChange = (file: File | null) => {
    setRecipeImage(file);
  };

  const handleStepImageChange = (seq: number, file: File | null): void => {
    setRecipeMethods((prevMethods) =>
      prevMethods.map((method, i) =>
        i === seq ? { ...method, photo: file || method.photo } : method
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
            uploadedImage={
              recipeImage instanceof File
                ? URL.createObjectURL(recipeImage)
                : recipeImage
            }
            onChangeImage={handleImageChange}
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
        <RecipeDetailButton onClick={handleSave} label="수정하기" />
        <RecipeCancelButton />
      </div>
    </div>
  );
};

export default RecipeEdit;
