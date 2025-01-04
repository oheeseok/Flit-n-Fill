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
  const RECIPE_STEP_DEFAULT_IMG_URL =
    "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png";
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
      const response = await axios.get(`/api/recipes/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
        },
      });
      const recipe = response.data;

      setRecipeTitle(recipe.recipeTitle);
      setRecipeImage(recipe.recipeMainPhoto); // 기존에 등록된 이미지 사용 (string 타입)
      setRecipeIngredients(recipe.recipeFoodDetails);

      const steps = recipe.recipeSteps.map((step: any, index: number) => ({
        seq: index + 1,
        photo: step.photo,
        description: step.description,
      }));

      setRecipeMethods(steps); // 기존에 등록된 recipeSteps (photo는 string 타입)

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
    console.log("Recipe methods before submission:", recipeMethods);
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
      const recipeUpdateDto = {
        recipeTitle,
        recipeFoodDetails: recipeIngredients,
        recipeSteps: recipeMethods.map((method, idx) => {
          let photoUrl = method.photo;

          // `File` 객체인 경우 URL 생성
          if (method.photo instanceof File) {
            photoUrl = URL.createObjectURL(method.photo);
          }

          return {
            seq: idx + 1,
            description: method.description || "",
            photo: photoUrl || RECIPE_STEP_DEFAULT_IMG_URL, // URL 또는 기본 이미지
          };
        }),
      };

      recipeUpdateDto.recipeSteps.forEach((step, index) => {
        console.log(`Step ${index + 1}:`, {
          seq: step.seq,
          description: step.description,
          photo: step.photo,
        });
      });

      const formData = new FormData();
      // DTO 확인
      console.log("Generated recipeUpdateDto:", recipeUpdateDto);

      formData.append("recipeUpdateDto", JSON.stringify(recipeUpdateDto));

      // 메인 이미지 파일 추가
      if (recipeImage instanceof File) {
        formData.append("recipeMainPhoto", recipeImage);
      }

      const stepPhotos = recipeMethods.map((method) => method.photo);

      stepPhotos.forEach((photo) => {
        if (typeof photo === "string" && photo) {
          // photo가 string이고 빈 문자열이 아니면 처리
          formData.append("recipeStepPhotos", new Blob([]));
        } else if (photo instanceof File) {
          // photo가 File 객체라면 해당 파일을 formData에 추가
          formData.append("recipeStepPhotos", photo);
        } else {
          // photo가 undefined일 경우 빈 Blob 추가
          formData.append("recipeStepPhotos", new Blob([]));
        }
      });

      console.log("Final Recipe Update DTO:", recipeUpdateDto);

      formData.append(
        "recipeStepPhotos",
        new Blob(["Test content"], { type: "text/plain" })
      );
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(`${key} is a Blob:`, {
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }
      // 서버에 PUT 요청 (axios 사용)
      const response = await axios.put(`/api/recipes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          userEmail: localStorage.getItem("userEmail"),
          // "Content-Type" 제거: axios는 자동으로 처리함
        },
        withCredentials: true,
      });
      console.log("Recipe updated successfully:", response.data);
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
        photo: RECIPE_STEP_DEFAULT_IMG_URL, // 디폴트 이미지 설정
        description: "",
      },
    ]);
  };

  const delRecipeMethod = (index: number) => {
    setRecipeMethods((prevMethods) => {
      const deletedMethod = prevMethods[index];
      console.log("Deleted method:", deletedMethod);

      const updatedMethods = prevMethods
        .filter((_, i) => i !== index)
        .map((method, idx) => ({ ...method, seq: idx + 1 }));

      return updatedMethods;
    });
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
                  typeof method.photo === "string" && method.photo !== ""
                    ? method.photo // method.photo가 문자열이면서 빈 문자열이 아니면 원래 URL 사용
                    : method.photo instanceof File
                    ? URL.createObjectURL(method.photo) // method.photo가 File이면 해당 file로 URL 생성
                    : RECIPE_STEP_DEFAULT_IMG_URL // 그 외의 경우는 기본 이미지 URL 사용
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
