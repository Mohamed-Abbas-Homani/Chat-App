import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import { useIsDarkMode } from "../../services/store";
import FileComponent from "./MediaComponents/FileComponent";
import { AudioComponent, ImageComponent, VideoComponent } from "./MediaComponents";

const fadeInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) translateX(-100px) ;
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0deg);
  }
`;

const fadeInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) translateX(-100px) ;
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
`;

const StatusMark = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ $status }) =>
    $status === "seen"
      ? css`
          color: #07c4a2;
        `
      : css`
          color: gray;
        `}
  transition: color 0.3s ease;

  &:hover {
    color: darkblue;
  }
`;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
};

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
  animation: ${({ $isCurrentUser }) =>
      $isCurrentUser ? fadeInFromRight : fadeInFromLeft}
    0.3s ease-in-out;
  ${({ $isCurrentUser }) =>
    $isCurrentUser
      ? css`
          flex-direction: row-reverse;
        `
      : css`
          flex-direction: row;
        `}
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessageContent = styled.div`
  color: ${(props) => (props.$isDarkMode ? "white" : "black")};
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 60%;
  padding: 10px 25px;
  padding-left: 25px;
  border-radius: 10px;
  background: ${({ $isCurrentUser, $isDarkMode }) =>
    $isCurrentUser
      ? css`
          linear-gradient(135deg, ${$isDarkMode ? "#44323a" : "#fcf8c6"} 0%, ${
          $isDarkMode ? "#3b4e32" : "#cdeebb"
        } 100%);
        `
      : css`
          linear-gradient(135deg, ${$isDarkMode ? "#655" : "#fff1f1"} 0%, ${
          $isDarkMode ? "#444" : "#e6e6e6"
        } 100%);
        `};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 10px;
  }
`;

const MarkdownContent = styled(ReactMarkdown)`
  word-break: break-word;
  overflow-wrap: break-word;
`;

const Username = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#ccc" : "#333")};
`;

const TimestampContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 5px;
`;

const Timestamp = styled.span`
  font-size: 0.8em;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#bbb" : "#888")};
  margin-right: 5px;
`;

const Message = ({ msg, isCurrentUser, user, currentUser, sendMessage }) => {
  const isDarkMode = useIsDarkMode();
  const { deleteMessage } = useDeleteMessage();
  const avatarUrl = isCurrentUser
    ? currentUser.profile_picture
    : user?.profile_picture;
  const username = user?.username;
  const timestamp = formatTimestamp(msg.CreatedAt);
  const [showTrash, setShowTrash] = useState(false);

  const renderMedia = (filePath, mediaType) => {
    const fileUrl = `http://localhost:8080/${filePath}`;
    switch (mediaType) {
      case "image/*":
        return <ImageComponent src={fileUrl} />;
      case "video/*":
        return <VideoComponent src={fileUrl} />;
      case "audio/*":
        return <AudioComponent src={fileUrl} />;
      default:
        return <FileComponent src={fileUrl} />;
    }
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={isDarkMode ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <MessageContainer
      $isCurrentUser={isCurrentUser}
      id={msg.ID}
      onMouseOver={() => setShowTrash(true)}
      onMouseLeave={() => setShowTrash(false)}
    >
      <Avatar
        src={`http://localhost:8080/${avatarUrl ?? "uploads/default.jpg"}`}
        alt={username}
      />
      <MessageContent $isCurrentUser={isCurrentUser} $isDarkMode={isDarkMode}>
        {!msg.recipient_id && !isCurrentUser && (
          <Username $isDarkMode={isDarkMode}>{username}</Username>
        )}
        {msg.content && (
          <MarkdownContent components={components}>
            {msg.content}
          </MarkdownContent>
        )}
        {msg.file_path && renderMedia(msg.file_path, msg.media_type)}
        <TimestampContainer>
          {msg.sender_id === currentUser.ID && showTrash && (
            <FaTrash
              color="gray"
              size={"0.8em"}
              style={{ marginRight: "5px", cursor: "pointer" }}
              onClick={() => {
                deleteMessage(msg.ID);
                sendMessage({
                  recipient_id: msg.sender_id,
                  sender_id: msg.recipient_id,
                  ID: msg.ID,
                  message_type: "status",
                  status: "deleted",
                });
              }}
            />
          )}
          <Timestamp $isDarkMode={isDarkMode}>{timestamp}</Timestamp>
          {msg.sender_id === currentUser.ID && !showTrash && (
            <StatusMark $status={msg.status}>
              {msg.status === "sent" && <IoCheckmark size={"1.2em"} />}
              {msg.status === "delivered" && <IoCheckmarkDone size={"1.2em"} />}
              {msg.status === "seen" && <IoCheckmarkDone size={"1.2em"} />}
            </StatusMark>
          )}
        </TimestampContainer>
      </MessageContent>
    </MessageContainer>
  );
};

export default Message;
