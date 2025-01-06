import React, { useState, useEffect } from "react";
import styled from "styled-components";
import profileImg from "../../assets/images/samplerecipe.jpg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const HiddenInput = styled.input`
  display: none;
`;

const MyProfileImg = styled.img`
  width: 686px;
  height: 600px;
  border-radius: 30px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  &:hover {
    border: 1px solid #ffcbc3;
    box-shadow: 0 0 10px rgba(255, 203, 195, 1);
  }
`;

interface RecipeImageUploaderProps {
  onChangeImage: (file: File | null) => void; // 파일 객체 전달
  uploadedImage: string | null; // 서버에서 받은 미리보기 이미지 URL
}

function RecipeImageUploader({
  onChangeImage,
  uploadedImage,
}: RecipeImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(uploadedImage); // 미리보기 이미지 상태

  // uploadedImage가 변경될 때 preview 상태를 업데이트
  useEffect(() => {
    setPreview(uploadedImage);
  }, [uploadedImage]);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log("Selected File:", {
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
      });
      setPreview(previewUrl);
      onChangeImage(file);
  
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      console.log("File selection canceled.");
      setPreview(null);
      onChangeImage(null);
    }
  };

  return (
    <Container>
      <MyProfileImg
        src={preview || profileImg}
        alt="레시피 이미지"
        onClick={() => document.getElementById("file-input")?.click()}
      />
      <HiddenInput
        id="file-input"
        type="file"
        accept="image/*"
        onChange={onChangeFile}
      />
    </Container>
  );
}

export default RecipeImageUploader;
