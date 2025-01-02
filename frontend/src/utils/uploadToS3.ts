export const uploadToS3 = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/recipes", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    return data.url; // 업로드된 이미지 URL 반환
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
