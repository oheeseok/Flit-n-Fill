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
const apiUrl = import.meta.env.VITE_API_URL;

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
  const [deletedSeqs, setDeletedSeqs] = useState<number[]>([]);

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
        recipeSteps: recipeMethods.map((method, idx) => ({
          seq: idx + 1,
          description: method.description || "",
        })),
      };

      console.log("Generated recipeUpdateDto:", recipeUpdateDto);

      const formData = new FormData();

      // DTO 추가
      formData.append("recipeUpdateDto", JSON.stringify(recipeUpdateDto));

      // 메인 이미지 파일 추가
      if (recipeImage instanceof File) {
        formData.append("recipeMainPhoto", recipeImage);
      }

      // 전체 스텝 처리
      const totalSteps = Math.max(
        ...recipeMethods.map((m) => m.seq),
        ...deletedSeqs
      ); // 최대 스텝 수 계산

      // 스텝 사진 처리
      for (let i = 1; i <= totalSteps; i++) {
        const method = recipeMethods.find((m) => m.seq === i);

        if (deletedSeqs.includes(i)) {
          // 삭제된 스텝: 빈 Blob 추가
          console.log(`Deleted step: seq=${i}, adding empty Blob.`);
          formData.append(
            "recipeStepPhotos",
            new Blob([], { type: "image/png" })
          );
        } else if (method?.photo instanceof File) {
          // 새로 추가된 파일
          console.log(`Adding step photo for seq=${i}`);
          formData.append("recipeStepPhotos", method.photo);
        } else if (
          method &&
          typeof method.photo === "string" &&
          method.photo.startsWith("http")
        ) {
          // 기존 URL 처리: 빈 Blob 추가
          console.log(`Existing URL for seq=${i}, adding empty Blob.`);
          formData.append(
            "recipeStepPhotos",
            new Blob([], { type: "image/png" })
          ); // 서버에서 URL 처리
        } else {
          // 기본 빈 Blob 처리 (예상치 못한 경우)
          console.warn(
            `No valid method or photo for seq=${i}, adding empty Blob.`
          );
          formData.append(
            "recipeStepPhotos",
            new Blob([], { type: "image/png" })
          );
        }
      }

      // 폼데이터 디버깅
      for (const [key, value] of formData.entries()) {
        console.log(
          `Key: ${key}, Value: ${value instanceof File ? value.name : value}`
        );
      }
      // 서버에 PUT 요청 (axios 사용)

      const response = await axios.put(
        `${apiUrl}/api/recipes/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            userEmail: localStorage.getItem("userEmail"),
            // "Content-Type" 제거: axios는 자동으로 처리함
          },
          withCredentials: true,
        }
      );
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

    setDeletedSeqs((prevSeqs) => [...prevSeqs, index + 1]); // 삭제된 seq를 저장
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
          <div className="recipe-edit-title-text">요리 이름</div>
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
        <div className="recipe-edit-ingredients-title">재료</div>
        <textarea
          className="recipe-edit-ingredients-textbox"
          placeholder="재료를 입력해 주세요."
          value={recipeIngredients}
          onChange={(e) => setRecipeIngredients(e.target.value)}
        ></textarea>
      </div>
      <div className="recipe-edit-method-container">
        <div className="recipe-edit-method-title">조리 순서</div>
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
