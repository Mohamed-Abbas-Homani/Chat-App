import { useState } from "react";
import axios from "axios";
import { useToken } from "../services/store";

const useFileUpload = () => {
  const token = useToken()
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8080/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
      setUploading(false);
      return response.data;
    } catch (err) {
      setUploading(false);
      setError(err);
      throw err;
    }
  };

  return { uploadFile, uploading, error };
};

export default useFileUpload;
