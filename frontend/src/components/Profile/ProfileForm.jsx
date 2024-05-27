import React, { useState } from "react";
import { useUser } from "../../services/store";
import {
  Avatar,
  Username,
  Email,
  Form,
  Input,
  TextArea,
  Button,
  FileInputLabel,
  HiddenFileInput,
  UserAvatar,
  CancelButton,
} from "./Style";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import ProfileImageInput from "./ProfileImageInput";

const ProfileForm = () => {
  const user = useUser();
  const { updateProfile } = useUpdateProfile();
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [status, setStatus] = useState(user.status || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("status", status);
    formData.append("id", user.ID);
    if (file) {
      formData.append("profilePicture", file);
    }

    await updateProfile(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Avatar
        src={`http://localhost:8080/${
          user.profile_picture ?? "uploads/default.jpg"
        }`}
        alt={username}
      />
      <Username>{user.username}</Username>
      <Email>{user.email}</Email>
      <Input
        type="text"
        placeholder="New username"
        value={username}
        onChange={handleUsernameChange}
      />
      <TextArea
        placeholder="Bio"
        value={bio}
        onChange={handleBioChange}
      />
      <Input
        type="text"
        placeholder="Status"
        value={status}
        onChange={handleStatusChange}
      />
      <ProfileImageInput
        file={file}
        preview={preview}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
      />
      <Button type="submit">Update Profile</Button>
    </Form>
  );
};

export default ProfileForm;
