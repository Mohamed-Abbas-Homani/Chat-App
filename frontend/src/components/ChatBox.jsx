import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  useMessages,
  useRecipient,
  useResetUnseenMsg,
  useUnseenMessages,
  useUser,
  useUsers,
} from "../services/store";
import Message from "./Message";
import humanReadableTimeDifference from "../helpers/timeHelper";
import {
  ChatContainer,
  TopBarContainer,
  UserAvatar,
  UserInfo,
  Username,
  UserStatus,
  LastSeen,
  MessagesWrapper,
  FormWrapper,
  TextArea,
  Button,
  EmojiButton,
  EmojiPickerWrapper,
  Modal,
  ModalContent,
  ModalClose,
  ButtonSearch,
} from "./ChatBoxStyles";

const EmojiPicker = ({ onSelect }) => {
  const emojis = ["😊", "😂", "😍", "😎", "👍", "❤️", "🎉"];
  return (
    <EmojiPickerWrapper>
      {emojis.map((emoji, index) => (
        <EmojiButton key={index} onClick={() => onSelect(emoji)}>
          {emoji}
        </EmojiButton>
      ))}
    </EmojiPickerWrapper>
  );
};

const TopBar = ({ recipient, onAvatarClick, onSearch }) => {
  const currentUser = useUser();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <TopBarContainer>
      <UserAvatar
        src={`http://localhost:8080/${
          recipient.ProfilePicture || "uploads/default.jpg"
        }`}
        alt="Profile"
        onClick={onAvatarClick}
      />
      <UserInfo>
        <Username>
          {recipient.username}
          {currentUser.ID === recipient.ID ? "(You)" : ""}
        </Username>
        <UserStatus
          $online={
            recipient.status != "Offline" || currentUser.ID == recipient.ID
          }
        >
          {currentUser.ID == recipient.ID ? "Online" : recipient.status}
          {recipient.status == "Offline" &&
            ` ~ ${humanReadableTimeDifference(recipient.last_seen)}`}
        </UserStatus>
        {!recipient.Online && recipient.LastSeen && (
          <LastSeen>
            Last seen {humanReadableTimeDifference(recipient.LastSeen)}
          </LastSeen>
        )}
      </UserInfo>
      <form
        onSubmit={handleSearch}
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          marginRight: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search messages"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: "5px", marginRight: "5px", borderRadius: "5px" }}
        />
        <ButtonSearch type="submit">Search</ButtonSearch>
      </form>
    </TopBarContainer>
  );
};

const MessagesContainer = ({ messages, currentUser, users, recipientId }) => {
  const messagesEndRef = useRef(null);
  const unseenMessages = useUnseenMessages();

  useEffect(() => {
    const unseenCount = unseenMessages[recipientId];
    if (unseenCount > 0) {
      document
        .getElementById(messages[messages.length - unseenCount].ID)
        .scrollIntoView({ behavior: "smooth" });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <MessagesWrapper>
      {messages.map((msg) => {
        const isCurrentUser = msg.sender_id === currentUser.ID;
        const user = users.find((u) => u.ID === msg.sender_id);
        return (
          <Message
            key={msg.ID}
            msg={msg}
            isCurrentUser={isCurrentUser}
            user={user}
            currentUser={currentUser}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </MessagesWrapper>
  );
};

const Form = ({
  input,
  setInput,
  handleSubmit,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSelectEmoji,
}) => (
  <FormWrapper onSubmit={handleSubmit}>
    <TextArea
      placeholder="Type a message"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      rows={1}
    />
    <Button type="submit" disabled={showEmojiPicker}>
      Send
    </Button>
    <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
      😀
    </EmojiButton>
    {showEmojiPicker && <EmojiPicker onSelect={handleSelectEmoji} />}
  </FormWrapper>
);

const ProfilePictureModal = ({ show, onClose, src }) => (
  <Modal $show={show}>
    <ModalContent>
      <ModalClose onClick={onClose}>&times;</ModalClose>
      <img
        src={src}
        alt="Profile"
        style={{ width: "100%", borderRadius: "5px" }}
      />
    </ModalContent>
  </Modal>
);

const ChatBox = ({ sendMessage }) => {
  const messages = useMessages();
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const recipient = useRecipient();
  const currentUser = useUser();
  const users = useUsers();
  const resetUnseenMsg = useResetUnseenMsg();

  useEffect(() => {
    if (input) {
      sendMessage({
        message_type: "system",
        status: "sent",
        content: "is typing...",
        sender_id: currentUser.ID,
        recipient_id: recipient.ID,
      });
    } else {
      sendMessage({
        message_type: "system",
        status: "sent",
        content: "Online",
        sender_id: currentUser.ID,
        recipient_id: recipient.ID,
      });
    }
  }, [input, recipient]);

  useEffect(() => {
    if (showEmojiPicker) {
      sendMessage({
        message_type: "system",
        status: "sent",
        content: "is picking emoji...",
        sender_id: currentUser.ID,
        recipient_id: recipient.ID,
      });
    } else {
      sendMessage({
        message_type: "system",
        status: "sent",
        content: "Online",
        sender_id: currentUser.ID,
        recipient_id: recipient.ID,
      });
    }
  }, [showEmojiPicker, recipient]);
  useEffect(() => {
    if (recipient.ID) {
      resetUnseenMsg(recipient.ID);
      sendMessage({
        message_type: "status",
        status: "seen",
        sender_id: recipient.ID,
        recipient_id: currentUser.ID,
      });
    }
  }, [recipient.ID, messages.length]);

  const filteredMessages = useMemo(() => {
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
  }, [messages.length, recipient.ID, currentUser.ID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({
      message_type: "chat",
      sender_id: currentUser.ID,
      recipient_id: recipient.ID,
      content: input,
      status: "not sent",
    });
    setInput("");
  };

  const handleSelectEmoji = (emoji) => {
    setInput((last) => last + emoji);
    setShowEmojiPicker(false);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      const results = filteredMessages.filter((msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (results.length > 0) {
        const firstResult = results[0];
        document
          .getElementById(firstResult.ID)
          ?.scrollIntoView({ behavior: "smooth" });
        const element = document.getElementById(firstResult.ID);
        element.style.filter = "brightness(0.7)";
        setTimeout(() => {
          element.style.filter = "brightness(1)";
        }, 2000);
      }
    }
  };

  return (
    <ChatContainer>
      {recipient && (
        <TopBar
          recipient={recipient}
          onAvatarClick={() => setShowProfileModal(true)}
          onSearch={handleSearch}
        />
      )}
      <MessagesContainer
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
            recipient.ProfilePicture || "uploads/default.jpg"
          }`}
        />
      )}
    </ChatContainer>
  );
};

export default ChatBox;
