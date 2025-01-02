import React from "react";
import styled from "styled-components";
import sample from "../../assets/images/sample.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const HiddenInput = styled.input`
  display: none;
`;

const MyProfileImg = styled.img`
  width: 100%;
  height: 600px;
  border-radius: 30px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #d9d9d9; /* 디폴트 테두리 */
  &:hover {
    border: 1px solid #ffcbc3; /* 호버 시 강조 효과 */
    box-shadow: 0 0 10px rgba(255, 203, 195, 1);
  }
`;

interface CommunityImageEditProps {
  onChangeImage: (image: File) => void;
  uploadedImage: File | null;
}

function CommunityImageEdit({
  onChangeImage,
  uploadedImage,
}: CommunityImageEditProps) {
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     if (reader.result) {
    //       onChangeImage(File);
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // }
    if (file) {
      onChangeImage(file)
    }
  };

  // 안전하게 `URL.createObjectURL` 호출
  const imageSrc = uploadedImage
  ? (() => {
      try {
        return URL.createObjectURL(uploadedImage);
      } catch (error) {
        console.error("Error creating object URL:", error);
        return sample; // 기본 이미지로 대체
      }
    })()
  : sample;

  return (
    <Container>
      <MyProfileImg
        src={ 
          typeof uploadedImage === "string"
            ? uploadedImage // URL
            : uploadedImage
            ? URL.createObjectURL(uploadedImage) // File
            : sample // 기본 이미지
         }
        alt="게시글 이미지"
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

export default CommunityImageEdit;
