import React, { useEffect, useState, useMemo } from "react";
import {
  useMessages,
  useRecipient,
  useResetUnseenMsg,
  useUpdateMsg,
  useUser,
  useUsers,
} from "../../services/store";
import { ChatContainer } from "./Style";
import TopBar from "./TopBar";
import MessagesContainer from "./MessagesContainer";
import Form from "./Form";
import ProfilePictureModal from "./ProfilePictureModal";

const ChatBox = ({ sendMessage }) => {
  const messages = useMessages();
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchResult, setSearchResult] = useState({ results: [], pos: 0 });
  const recipient = useRecipient();
  const currentUser = useUser();
  const users = useUsers();
  const resetUnseenMsg = useResetUnseenMsg();
  const [searchInput, setSearchInput] = useState("");
  const updateMsg = useUpdateMsg();
  const updateTypingStatus = () => {
    sendMessage({
      message_type: "system",
      status: "sent",
      content: input ? "is typing..." : "Online",
      sender_id: currentUser.ID,
      recipient_id: recipient.ID,
    });
  };

  const updateEmojiPickerStatus = () => {
    sendMessage({
      message_type: "system",
      status: "sent",
      content: showEmojiPicker ? "is picking emoji..." : "Online",
      sender_id: currentUser.ID,
      recipient_id: recipient.ID,
    });
  };

  const updateRecipientStatus = () => {
    if (recipient.ID) {
      resetUnseenMsg(recipient.ID);
      sendMessage({
        message_type: "status",
        status: "seen",
        sender_id: recipient.ID,
        recipient_id: currentUser.ID,
      });
    }
  };

  const getFilteredMessages = () => {
    if (recipient.ID) {
      return messages.filter(
        (msg) =>
          (msg.sender_id === currentUser.ID &&
            msg.recipient_id === recipient.ID) ||
          (msg.sender_id === recipient.ID &&
            msg.recipient_id === currentUser.ID)
      );
    } else {
      return messages.filter((msg) => msg.recipient_id === 0);
    }
  };

  const handleSubmit = () => {
    if (input) {
      sendMessage({
        message_type: "chat",
        sender_id: currentUser.ID,
        recipient_id: recipient.ID,
        content: input,
        status: "not sent",
      });
      setInput("");
    }
  };

  const handleSelectEmoji = (emoji) => {
    setInput((last) => last + emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (searchResult.results.length)
      goToMessage(searchResult.results[searchResult.pos]);
  }, [searchResult.pos]);

  const goToMessage = (message) => {
    const lastContent = message.content;
    const arrowRight = "➡️";
    const arrowLeft = "⬅️";
    message = {
      ...message,
      content: message.content.replace(
        searchInput,
        `${arrowRight}**${searchInput}**${arrowLeft}`
      ),
    };
    updateMsg(message);
    document.getElementById(message.ID)?.scrollIntoView({ behavior: "smooth" });
    const element = document.getElementById(message.ID);
    element.style.filter = "brightness(0.8)";
    setTimeout(() => {
      element.style.filter = "brightness(1)";
      message = { ...message, content: lastContent };
      updateMsg(message);
    }, 1000);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      const results = filteredMessages.filter((msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResult({ results, pos: results.length - 1 });
    }
  };

  useEffect(updateTypingStatus, [input, recipient.ID]);
  useEffect(updateEmojiPickerStatus, [showEmojiPicker, recipient.ID]);
  useEffect(updateRecipientStatus, [recipient.ID, messages.length]);

  const filteredMessages = useMemo(getFilteredMessages, [
    messages.length,
    recipient.ID,
    currentUser.ID,
  ]);

  return (
    <ChatContainer>
      {recipient && (
        <TopBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          recipient={recipient}
          onAvatarClick={() => setShowProfileModal(true)}
          onSearch={handleSearch}
          setSearchResult={setSearchResult}
          searchResult={searchResult}
        />
      )}
      <MessagesContainer
        sendMessage={sendMessage}
        messages={filteredMessages}
        currentUser={currentUser}
        users={users}
        recipientId={recipient.ID}
      />
      <Form
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleSelectEmoji={handleSelectEmoji}
      />
      {recipient && (
        <ProfilePictureModal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          src={`http://localhost:8080/${
            recipient.profile_picture || "uploads/default.jpg"
          }`}
        />
      )}
    </ChatContainer>
  );
};

export default ChatBox;
