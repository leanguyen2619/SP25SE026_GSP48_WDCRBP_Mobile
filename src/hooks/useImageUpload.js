import { useState } from "react";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = "9c2cd5d2f4d9a8e8c2f306fb6781e606";
  const API_URL = "https://api.imgbb.com/1/upload";

  const uploadImage = async (imageData) => {
    try {
      setUploading(true);
      setError(null);

      // Tạo form data với ảnh
      const formData = new FormData();
      formData.append("key", API_KEY);

      // Kiểm tra loại dữ liệu đầu vào
      if (typeof imageData === "string") {
        // Kiểm tra xem đây có phải là URI hay chuỗi base64
        if (
          imageData.startsWith("data:image") ||
          imageData.startsWith("http")
        ) {
          // Đây là URI hoặc chuỗi Data URL, gửi trực tiếp
          formData.append("image", imageData);
        } else {
          // Đây là chuỗi base64 thuần túy
          formData.append("image", imageData);
        }
      } else if (imageData instanceof File || imageData instanceof Blob) {
        // Trường hợp là File hoặc Blob
        formData.append("image", imageData);
      } else {
        // Trường hợp là URI chuỗi (đường dẫn ảnh) - giả sử cấu trúc như trước
        const filename = imageData.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: imageData,
          name: filename || `upload_${Date.now()}.jpg`,
          type,
        });
      }

      // Upload lên imgbb
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        return {
          url: result.data.url,
          filename: result.data.title,
        };
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (imageUris) => {
    try {
      setUploading(true);
      setError(null);

      const uploadPromises = imageUris.map((uri) => uploadImage(uri));
      const results = await Promise.all(uploadPromises);

      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    error,
  };
};
