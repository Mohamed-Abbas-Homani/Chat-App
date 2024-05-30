import { useState } from "react";
import axios from "axios";
import { useSetLogin } from "../services/store";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [clientError, setClientError] = useState("");
  const setLogin = useSetLogin();

  const validateForm = () => {
    if (!email) {
      setClientError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setClientError("Email is invalid.");
      return false;
    }
    if (!password) {
      setClientError("Password is required.");
      return false;
    }
    setClientError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      setLogin(user, token);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    clientError,
    handleSubmit,
  };
};

export default useLogin;
