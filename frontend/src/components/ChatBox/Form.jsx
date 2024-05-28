import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip } from "react-icons/fi";
import {
  FormWrapper,
  TextArea,
  SendButton,
  EmojiButtonWrapper,
  FileButtonWrapper,
  HiddenFileInput,
  FileTypeMenu,
  FileTypeOption,
} from "./Style";
import EmojiPicker from "./EmojiPicker";
import useFileUpload from "../../hooks/useFileUpload";
import { useRecipient, useUser } from "../../services/store";
import CropperModal from "./CropperModal"; // Import CropperModal

// List of emojis to cycle through
const emojis = ["😀", "😁", "😂", "🤣", "😊", "😇", "🥰", "😍", "🤩", "😘"];

const Form = ({
  input,
  setInput,
  handleSubmit,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSelectEmoji,
  sendMessage,
}) => {
  const [currentEmoji, setCurrentEmoji] = useState("😀");
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [fileInputType, setFileInputType] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false); // State to manage cropper modal visibility
  const { uploadFile, uploading, error } = useFileUpload();
  const recipient = useRecipient();
  const currentUser = useUser();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setCurrentEmoji(randomEmoji);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleFileMenuClick = () => {
    setShowFileMenu(!showFileMenu);
  };

  const handleFileTypeSelect = (type) => {
    setFileInputType(type);
    setShowFileMenu(false);
    document.getElementById("fileInput").setAttribute("accept", type);
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && fileInputType.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } else {
      uploadAndSendFile(file);
    }
  };

  const uploadAndSendFile = async (file, croppedImage = null) => {
    try {
      const response = await uploadFile(file, croppedImage);
      console.log("File uploaded successfully:", response);
      sendMessage({
        recipient_id: recipient.ID,
        sender_id: currentUser.ID,
        message_type: `chat`,
        status: "not sent",
        file_path: response.filePath,
        media_type: fileInputType,
      });
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleCrop = (croppedImageDataUrl) => {
    const croppedFile = dataURLtoFile(croppedImageDataUrl, "cropped-image.jpg");
    uploadAndSendFile(croppedFile);
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Prevent form submission and add a new line
        e.preventDefault();
        setInput(input + "  \n");
      } else {
        // Submit the form
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  return (
    <>
      {showCropper && (
        <CropperModal
          src={imageSrc}
          onClose={() => setShowCropper(false)}
          onCrop={handleCrop}
        />
      )}
      <FormWrapper>
        <FileButtonWrapper onClick={handleFileMenuClick}>
          <FiPaperclip size={"1.2em"} />
          {showFileMenu && (
            <FileTypeMenu>
              <FileTypeOption onClick={() => handleFileTypeSelect("image/*")}>
                🖼️ Image
              </FileTypeOption>
              <FileTypeOption onClick={() => handleFileTypeSelect("video/*")}>
                🎥 Video
              </FileTypeOption>
              <FileTypeOption onClick={() => handleFileTypeSelect("audio/*")}>
                🎵 Audio
              </FileTypeOption>
              <FileTypeOption onClick={() => handleFileTypeSelect("*/*")}>
                📁 File
              </FileTypeOption>
            </FileTypeMenu>
          )}
          <HiddenFileInput
            id="fileInput"
            type="file"
            onChange={handleFileChange}
          />
        </FileButtonWrapper>
        <TextArea
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <EmojiButtonWrapper onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {currentEmoji}
        </EmojiButtonWrapper>
        {showEmojiPicker && <EmojiPicker onSelect={handleSelectEmoji} />}
        <SendButton onClick={handleSubmit} disabled={!input.trim() || uploading}>
          <IoMdSend size={"1.2em"} />
        </SendButton>
      </FormWrapper>
    </>
  );
};

export default Form;
