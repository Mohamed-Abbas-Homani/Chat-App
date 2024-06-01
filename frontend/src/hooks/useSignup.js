// useSignup.js
import { useState } from "react";
import axios from "axios";

const useSignup = (setIsLogin) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(null);

  const validateInputs = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    return newErrors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setBackendError(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePicture) formData.append("profilePicture", profilePicture);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        setIsLogin(true)
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setBackendError(error.response.data.error);
      } else {
        setBackendError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    profilePicture,
    preview,
    errors,
    backendError,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
  };
};

export default useSignup;
