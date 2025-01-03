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
          if (method.photo && typeof method.photo === "string") {
            // 이미지 URL이 있으면 그대로 사용
            if (method.photo !== "") {
              return {
                seq: method.seq,
                description: method.description,
                photo: method.photo, // method.photo,
              };
            } else {
              return {
                seq: method.seq,
                description: method.description,
                photo: RECIPE_STEP_DEFAULT_IMG_URL,
              };
            }
          } else {
            // method.photo가 undefined일 경우
            return {
              seq: method.seq,
              description: method.description,
              photo: RECIPE_STEP_DEFAULT_IMG_URL,
            };
          }
        }),
      };

      formData.append("recipeUpdateDto", JSON.stringify(recipeUpdateDto));
      console.log(recipeUpdateDto.recipeSteps); // 업데이트 전 기존 recipeMethods

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

      // for (var key of formData.keys()) {
      //   console.log("formData key: ", key);
      //   console.log("formData value: ", formData.get(key));
      // }

      // 서버에 PUT 요청 (axios 사용)
      const response = await axios.put(`/api/recipes/${id}`, formData, {
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
        photo: RECIPE_STEP_DEFAULT_IMG_URL, // 디폴트 이미지 설정
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
