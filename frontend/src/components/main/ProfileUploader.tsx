import React from "react";
import styled from "styled-components";
import profileImg from "../../assets/images/profilesample.png";

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
        src={uploadedImage || profileImg}
        alt="프로필필 이미지"
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
