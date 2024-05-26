import React from "react";
import { FaPaperPlane, FaShare } from "react-icons/fa";
import { FormWrapper, TextArea, SendButton, EmojiButtonWrapper } from "./Style";
import EmojiPicker from "./EmojiPicker";
import { IoMdSend } from "react-icons/io";
const Form = ({
  input,
  setInput,
  handleSubmit,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSelectEmoji,
}) => (
  <FormWrapper>
    <TextArea
      placeholder="Type a message"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      rows={1}
    />
    <EmojiButtonWrapper onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
      😀
    </EmojiButtonWrapper>
    {showEmojiPicker && (
 
        <EmojiPicker onSelect={handleSelectEmoji} />
    
    )}
    <SendButton onClick={handleSubmit} disabled={!input.trim()}>
      <IoMdSend size={"1.2em"} />
    </SendButton>
  </FormWrapper>
);

export default Form;
