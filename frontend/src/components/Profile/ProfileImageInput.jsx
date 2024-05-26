import React from "react";
import {
  FileInputLabel,
  HiddenFileInput,
  CancelButton,
  UserAvatar,
} from "./Style";

const ProfileImageInput = ({
  file,
  preview,
  handleFileChange,
  handleRemoveImage,
}) => (
  <FileInputLabel>
    {preview ? (
      <>
        <UserAvatar src={preview} />
        {file.name}
        <CancelButton onClick={handleRemoveImage}>&times;</CancelButton>
      </>
    ) : (
      "Update profile picture"
    )}
    <HiddenFileInput type="file" accept="image/*" onChange={handleFileChange} />
  </FileInputLabel>
);

export default ProfileImageInput;
