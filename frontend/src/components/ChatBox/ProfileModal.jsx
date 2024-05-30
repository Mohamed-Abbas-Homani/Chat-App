import React, { useState } from "react";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import {
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  CloseButton,
  UserAvatarModal,
  ButtonModal,
} from "./Style";
import {
  useRecipient,
  useUpdateRecipient,
  useUpdateUser,
  useUser,
} from "../../services/store";
import useFetchUsers from "../../hooks/useFetchUsers";

const ProfileModal = ({ isOpen, onClose, user }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const { updateProfile } = useUpdateProfile();
  const recipient = useRecipient();
  const currentUser = useUser();
  const isCurrentUser = currentUser.ID === recipient.ID;
  const avatarUrl = isCurrentUser
    ? currentUser.profile_picture
    : user?.profile_picture;
  const updateRecipient = useUpdateRecipient();
  const updateUser = useUpdateUser();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("profile-picture-preview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    document.getElementById("file-input").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("id", recipient.ID);
    formData.append("bio", bio);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    await updateProfile(formData);
    onClose();
    updateRecipient({
      username,
      bio,
      profilePicture: profilePicture
        ? `uploads/${profilePicture.name}`
        : recipient.profilePicture,
    });
    updateUser({
      ID: currentUser.ID,
      username,
      bio,
      profilePicture: profilePicture
        ? `uploads/${profilePicture.name}`
        : recipient.profilePicture,
    });
  };

  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalContent>
        <ModalHeader>
          <h2>{recipient.username} Profile</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <UserAvatarModal
            id="profile-picture-preview"
            src={`http://localhost:8080/${avatarUrl || "uploads/default.jpg"}`}
            alt="Profile"
            onClick={handleAvatarClick}
          />
          <input
            disabled={!isCurrentUser}
            id="file-input"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <form onSubmit={handleSubmit}>
            <Input
              disabled={!isCurrentUser}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              disabled={!isCurrentUser}
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <ModalFooter>
              {isCurrentUser && <ButtonModal type="submit">Save</ButtonModal>}
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalContainer>
  );
};

export default ProfileModal;
