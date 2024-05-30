import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import ReactMarkdown from "react-markdown";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { ImageComponent, VideoComponent, AudioComponent, FileComponent } from "./MediaComponents";
import useDeleteMessage from "../../hooks/useDeleteMessage";

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
  ${({ status }) =>
    status === "seen"
      ? css`
          color: blue;
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
  hours = hours ? hours : 12; // the hour '0' should be '12'
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
  word-break: break-all;
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f1f1f1 0%, #e6e6e6 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  transition: background 0.3s ease;

  ${({ $isCurrentUser }) =>
    $isCurrentUser
      ? css`
          background: linear-gradient(135deg, #dcf8c6 0%, #cdeebb 100%);
        `
      : css`
          background: linear-gradient(135deg, #f1f1f1 0%, #e6e6e6 100%);
        `}
`;

const Username = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

const TimestampContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 5px;
`;

const Timestamp = styled.span`
  font-size: 0.8em;
  color: #888;
  margin-right: 5px;
`;

const Message = ({ msg, isCurrentUser, user, currentUser, sendMessage }) => {
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
      <MessageContent $isCurrentUser={isCurrentUser}>
        {!msg.recipient_id && !isCurrentUser && <Username>{username}</Username>}
        {msg.content && <ReactMarkdown>{msg.content}</ReactMarkdown>}
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
          <Timestamp>{timestamp}</Timestamp>
          {msg.sender_id === currentUser.ID && !showTrash && (
            <StatusMark status={msg.status}>
              {msg.status === "sent" && <IoCheckmark size={"1.2em"} />}
              {msg.status === "delivred" && <IoCheckmarkDone size={"1.2em"} />}
              {msg.status === "seen" && <IoCheckmarkDone size={"1.2em"} />}
            </StatusMark>
          )}
        </TimestampContainer>
      </MessageContent>
    </MessageContainer>
  );
};

export default Message;
