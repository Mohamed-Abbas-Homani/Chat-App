import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useSetLogin, useToken, useUser } from "../services/store";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const Username = styled.h2`
  margin-bottom: 10px;
`;

const Email = styled.p`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
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


const ProfilePage = () => {
  const user = useUser();
  const token = useToken();
  const setLogin = useSetLogin();
  const [username, setUsername] = useState(user.Username);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  const updateProfile = async (formData) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // If update successful, refresh the user data
      const updatedUser = response.data;
      // Update the user state with the updated data
      // Assuming you have a setUser function in your store to update the user state
      setLogin(updatedUser, token);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("id", user.ID);
    if (file) {
      formData.append("profilePicture", file);
    }

    await updateProfile(formData);
  };

  return (
    <ProfileContainer>
      <Avatar
        src={`http://localhost:8080/${
          user.ProfilePicture ?? "uploads/default.jpg"
        }`}
        alt={username}
      />
      <Username>{user.Username}</Username>
      <Email>{user.Email}</Email>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="New username"
          value={username}
          onChange={handleUsernameChange}
        />
        <FileInputLabel>
          {preview ? (
            <>
               <UserAvatar src={preview}/>
               {file.name}
              <CancelButton onClick={handleRemoveImage}>&times;</CancelButton>
            </>
          ) : (
            "Update profile picture"
          )}
          <HiddenFileInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FileInputLabel>
        <Button type="submit">Update Profile</Button>
      </Form>
    </ProfileContainer>
  );
};

export default ProfilePage;
