import React from "react";
import { FormWrapper, TextArea, Button, EmojiButton } from "./Style";
import EmojiPicker from "./EmojiPicker";

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
    <Button onClick={handleSubmit} disabled={showEmojiPicker}>
      Send
    </Button>
    <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
      😀
    </EmojiButton>
    {showEmojiPicker && <EmojiPicker onSelect={handleSelectEmoji} />}
  </FormWrapper>
);

export default Form;
