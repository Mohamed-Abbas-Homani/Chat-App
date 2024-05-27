import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import { FormWrapper, TextArea, SendButton, EmojiButtonWrapper } from "./Style";
import EmojiPicker from "./EmojiPicker";

// List of emojis to cycle through
const emojis = ["😀", "😁", "😂", "🤣", "😊", "😇", "🥰", "😍", "🤩", "😘"];

const Form = ({
  input,
  setInput,
  handleSubmit,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSelectEmoji,
}) => {
  const [currentEmoji, setCurrentEmoji] = useState("😀");

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setCurrentEmoji(randomEmoji);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
      <SendButton onClick={handleSubmit} disabled={!input.trim()}>
        <IoMdSend size={"1.2em"} />
      </SendButton>
    </FormWrapper>
  );
};

export default Form;
