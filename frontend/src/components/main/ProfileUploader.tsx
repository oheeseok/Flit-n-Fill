import React from "react";
import styled from "styled-components";

const DEFAULT_PROFILE_IMAGE =
  "https://flitnfill.s3.ap-northeast-2.amazonaws.com/default-img/recipe-step-default-img.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const HiddenInput = styled.input`
  display: none;
`;

const MyProfileImg = styled.img`
  max-width: 350px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #d9d9d9; /* 디폴트 테두리 */
  &:hover {
    border: 1px solid #ffcbc3; /* 호버 시 강조 효과 */
    box-shadow: 0 0 10px rgba(255, 203, 195, 1);
  }
`;

interface ProfileUploaderProps {
  onChangeImage: (image: string) => void;
  uploadedImage: string | null;
}

function ProfileImageUploader({
  onChangeImage,
  uploadedImage,
}: ProfileUploaderProps) {
  // 기본 이미지 설정
  const imageToDisplay = uploadedImage || DEFAULT_PROFILE_IMAGE;

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onChangeImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <MyProfileImg
        src={imageToDisplay} // 기본 이미지 또는 업로드된 이미지
        alt="프로필 이미지"
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

export default ProfileImageUploader;
