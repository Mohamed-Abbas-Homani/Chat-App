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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await uploadFile(file);
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
    }
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
  );
};

export default Form;
