import React, { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip, FiMic, FiStopCircle, FiXCircle } from "react-icons/fi";
import {
  FormWrapper,
  TextArea,
  SendButton,
  EmojiButtonWrapper,
  FileButtonWrapper,
  HiddenFileInput,
  FileTypeMenu,
  FileTypeOption,
  RecordingMenu,
  RecordingCancelButton,
  RecordingTimer,
} from "./Style";
import EmojiPicker from "./EmojiPicker";
import useFileUpload from "../../hooks/useFileUpload";
import { useIsDarkMode, useRecipient, useUser } from "../../services/store";
import CropperModal from "./PhotoPreprocessing/CropperModal"; // Import CropperModal

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
  const isDarkMode = useIsDarkMode();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef(null);
  const [isRecordingCancel, setIsRecordingCancel] = useState(false);

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
    if (file) {
      if (fileInputType.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      } else {
        uploadAndSendFile(file, fileInputType);
      }
    }
  };

  const uploadAndSendFile = async (file, fileType) => {
    try {
      const response = await uploadFile(file);
      sendMessage({
        recipient_id: recipient.ID,
        sender_id: currentUser.ID,
        message_type: `chat`,
        status: "not sent",
        file_path: response.filePath,
        media_type: fileType,
      });
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleCrop = (croppedImageDataUrl) => {
    const croppedFile = dataURLtoFile(
      croppedImageDataUrl,
      `cropped-image-at-${new Date().toString()}.jpg`
    );
    uploadAndSendFile(croppedFile, "image/*");
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

  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      console.error("Media devices or MediaRecorder API not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = handleAudioDataAvailable;
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setIsRecordingCancel(false); // Reset cancel state when starting a new recording

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleAudioDataAvailable = (event) => {
    setIsRecordingCancel((last) => {
      if (!last) {
        if (event.data.size > 0) {
          const audioFile = new File(
            [event.data],
            `audio-message-${Date.now()}.mp3`,
            { type: "audio/mp3" }
          );

          uploadAndSendFile(audioFile, "audio/*");
        }
      }
      return false;
    });
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      setIsRecordingCancel(true);
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
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
      <FormWrapper $isDarkMode={isDarkMode}>
        <FileButtonWrapper onClick={handleFileMenuClick}>
          <FiPaperclip size={"1.2em"} />
          {showFileMenu && (
            <FileTypeMenu $isDarkMode={isDarkMode}>
              <FileTypeOption
                onClick={() => handleFileTypeSelect("image/*")}
                $isDarkMode={isDarkMode}
              >
                🖼️ Image
              </FileTypeOption>
              <FileTypeOption
                onClick={() => handleFileTypeSelect("video/*")}
                $isDarkMode={isDarkMode}
              >
                🎥 Video
              </FileTypeOption>
              <FileTypeOption
                onClick={() => handleFileTypeSelect("audio/*")}
                $isDarkMode={isDarkMode}
              >
                🎵 Audio
              </FileTypeOption>
              <FileTypeOption
                onClick={() => handleFileTypeSelect("*/*")}
                $isDarkMode={isDarkMode}
              >
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
          $isDarkMode={isDarkMode}
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <EmojiButtonWrapper
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {currentEmoji}
        </EmojiButtonWrapper>
        {showEmojiPicker && <EmojiPicker onSelect={handleSelectEmoji} />}
        {input.trim() ? (
          <SendButton
            $isDarkMode={isDarkMode}
            onClick={handleSubmit}
            disabled={uploading}
          >
            <IoMdSend size={"1.2em"} />
          </SendButton>
        ) : (
          <SendButton
            $isDarkMode={isDarkMode}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <FiStopCircle size={"1.2em"} />
            ) : (
              <FiMic size={"1.2em"} />
            )}
          </SendButton>
        )}
        {isRecording && (
          <RecordingMenu $isDarkMode={isDarkMode}>
            <RecordingCancelButton
              onClick={cancelRecording}
              $isDarkMode={isDarkMode}
            >
              <FiXCircle size={"1.2em"} />
            </RecordingCancelButton>
            <RecordingTimer $isDarkMode={isDarkMode}>
              {new Date(recordingTime * 1000).toISOString().substr(14, 5)}
            </RecordingTimer>
          </RecordingMenu>
        )}
      </FormWrapper>
    </>
  );
};

export default Form;
