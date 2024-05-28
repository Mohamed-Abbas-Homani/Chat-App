import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
`;

const Button = styled.button`
  font-weight:bold;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const FileInputLabel = styled.label`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
  height: 50px;
  text-align: center;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #45a049;
  &:hover {
    filter: brightness(1.1);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CancelButton = styled.span`
  margin-left: 10px;
  color: white;
  cursor: pointer;
  font-size: 2em;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

const UserAvatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Signup = ({ isLogin, setIsLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

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
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePicture", profilePicture);

    try {
      const response = await axios.post(
        "http://192.168.1.5:8080/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Signed up successfully", response.data);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <SignupContainer>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ color: "#4caf50" }}>Signup</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FileInputLabel>
          {preview ? (
            <>
          
              <UserAvatar src={preview}/>
              {profilePicture.name}
              <CancelButton onClick={handleRemoveImage}>&times;</CancelButton>
            </>
          ) : (
            "Enter profile picture"
          )}
          <HiddenFileInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FileInputLabel>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </Button>
          <Button type="submit">SignUp</Button>
        </div>
      </Form>
    </SignupContainer>
  );
};

export default Signup;
