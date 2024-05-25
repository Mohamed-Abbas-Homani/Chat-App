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

  const handleSelectEmoji = (emoji) => {
    onSelect(emoji);
  };

  return (
    <EmojiPickerWrapper>
      {emojis.map((emoji, index) => (
        <EmojiButton
          type="button"
          key={index}
          onClick={() => handleSelectEmoji(emoji)}
        >
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
          recipient.ProfilePicture
            ? recipient.ProfilePicture
            : "uploads/default.jpg"
        }`}
        alt="Profile"
        onClick={onAvatarClick}
      />
      <UserInfo>
        <Username>
          {recipient.username}
          {currentUser.ID === recipient.ID ? "(You)" : ""}
        </Username>
        <UserStatus $online={recipient.Online}>
          {recipient.Online ? "Online" : `Offline`}
        </UserStatus>
        {!recipient.Online && recipient.LastSeen && (
          <LastSeen>
            Last seen {humanReadableTimeDifference(recipient?.LastSeen)}
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
  const unseenmessages = useUnseenMessages();
  useEffect(() => {
    const unseeMsgCount = unseenmessages[recipientId];
    if (unseeMsgCount > 0) {
      document
        .getElementById(messages[messages.length - unseeMsgCount].ID)
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
}) => {
  return (
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
};

const ProfilePictureModal = ({ show, onClose, src }) => {
  return (
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
};

const ChatBox = ({ sendMessage }) => {
  const messages = useMessages();
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const recipient = useRecipient();
  console.log("entred with recipient id : ", recipient.ID)
  const currentUser = useUser();
  const users = useUsers();
  const [searchResults, setSearchResults] = useState([]);
  const resetUnseenMsg = useResetUnseenMsg();
  useEffect(() => {
    if(recipient.ID) {
    resetUnseenMsg(recipient.ID);
    sendMessage({
      message_type:"status",
      status:"seen",
      sender_id: recipient.ID,
      recipient_id: currentUser.ID
    })
  }
  }, [recipient?.ID, messages.length]);
  const filteredMessages = useMemo(() => {
    if (recipient?.ID) {
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
  }, [messages.length, recipient?.ID, currentUser.ID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({
      message_type:"chat",
      sender_id:currentUser.ID,
      recipient_id:recipient.ID,
      content:input,
      status:"not sent"
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
      setSearchResults(results);
      if (results.length > 0) {
        document
          .getElementById(results[0].ID)
          ?.scrollIntoView({ behavior: "smooth" });
        document.getElementById(results[0].ID).style.filter = "brightness(0.7)";
        setTimeout(() => {
          document.getElementById(results[0].ID).style.filter = "brightness(1)";
        }, 2000);
      }
    } else {
      setSearchResults([]);
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
            recipient.ProfilePicture
              ? recipient.ProfilePicture
              : "uploads/default.jpg"
          }`}
        />
      )}
    </ChatContainer>
  );
};

export default ChatBox;
