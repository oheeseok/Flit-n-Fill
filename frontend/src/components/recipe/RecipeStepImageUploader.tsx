import React from "react";
import styled from "styled-components";
import profileImg from "../../assets/images/samplerecipe2.png";

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 이미지와 파일 입력 컨테이너를 가운데 정렬 */
  width: 100%;
  gap: 10px; /* 이미지와 기타 요소 사이에 간격 추가 */
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
  border: 1px solid #d9d9d9; /* 디폴트 테두리 */
  &:hover {
    border: 1px solid #ffcbc3; /* 호버 시 강조 효과 */
    box-shadow: 0 0 10px rgba(255, 203, 195, 1);
  }
  margin-right: 20px;
`;

interface RecipeStepImageUploaderProps {
  stepIndex: number;
  uploadedImage: string | null;
  onImageChange: (stepIndex: number, image: string) => void;
}

function RecipeStepImageUploader({
  stepIndex,
  uploadedImage,
  onImageChange,
}: RecipeStepImageUploaderProps) {
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageChange(stepIndex, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <StepContainer>
      <StepImage
        src={uploadedImage || profileImg}
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
