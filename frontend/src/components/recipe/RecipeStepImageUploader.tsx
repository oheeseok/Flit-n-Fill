import React, { useState } from "react";
import styled from "styled-components";
import profileImg from "../../assets/images/samplerecipemethod.jpg";

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const StepImage = styled.img`
  width: 240px;
  height: 240px;
  border-radius: 30px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  &:hover {
    border: 1px solid #ffcbc3;
    box-shadow: 0 0 10px rgba(255, 203, 195, 1);
  }
  margin-right: 20px;
`;

const RECIPE_STEP_DEFAULT_IMG_URL =
  "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png";

interface RecipeStepImageUploaderProps {
  stepIndex: number;
  uploadedImage: string | null; // 미리보기 이미지 URL
  onImageChange: (stepIndex: number, file: File | null) => void; // 파일 객체 전달
}

function RecipeStepImageUploader({
  stepIndex,
  uploadedImage,
  onImageChange,
}: RecipeStepImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(uploadedImage);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL); // 미리보기 URL 업데이트
      onImageChange(stepIndex, file); // 파일 객체 전달
    } else {
      // 파일이 없을 경우
      const emptyFile = new File([], ""); // 빈 파일 생성
      setPreview(RECIPE_STEP_DEFAULT_IMG_URL); // RECIPE_STEP_DEFAULT_IMG_URL 로 설정
      onImageChange(stepIndex, emptyFile); // emptyFile 전달
    }
  };

  return (
    <StepContainer>
      <StepImage
        src={preview || uploadedImage || profileImg} // 우선순위: 미리보기 > 업로드된 이미지 > 기본 이미지
        alt={`Step ${stepIndex + 1} 이미지`}
        onClick={() =>
          document.getElementById(`step-image-input-${stepIndex}`)?.click()
        }
      />
      <HiddenInput
        id={`step-image-input-${stepIndex}`}
        type="file"
        accept="image/*"
        onChange={onChangeFile}
      />
    </StepContainer>
  );
}
export default RecipeStepImageUploader;
