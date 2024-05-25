import React from "react";
import styled, { css } from "styled-components";
import ReactMarkdown from "react-markdown";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";

const StatusMark = ({ status }) => {
  if (status === "sent") return <IoCheckmark size={"1.2em"} />;
  else if (status === "delivred") return <IoCheckmarkDone size={"1.2em"} />;
  else return <IoCheckmarkDone color="blue" size={"1.2em"} />;
};

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
`;

const MessageContent = styled.div`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 10px;
  background: #f1f1f1;
  ${({ $isCurrentUser }) =>
    $isCurrentUser
      ? css`
          background: #dcf8c6;
        `
      : css`
          background: #f1f1f1;
        `}
`;

const Username = styled.span`
  font-weight: bold;
  display: block;
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

const Message = ({ msg, isCurrentUser, user, currentUser }) => {
  const avatarUrl = isCurrentUser
    ? currentUser.profile_picture
    : user?.profile_picture;
  const username = user?.username;
  const timestamp = formatTimestamp(msg.CreatedAt);

  return (
    <MessageContainer $isCurrentUser={isCurrentUser} id={msg.ID}>
      <Avatar
        src={`http://localhost:8080/${avatarUrl ?? "uploads/default.jpg"}`}
        alt={username}
      />
      <MessageContent $isCurrentUser={isCurrentUser}>
        {!msg.recipient_id && !isCurrentUser && <Username>{username}</Username>}
        <ReactMarkdown>{msg.content}</ReactMarkdown>
        <TimestampContainer>
          <Timestamp>{timestamp}</Timestamp>
          {msg.sender_id === currentUser.ID && (
            <StatusMark status={msg.status} />
          )}
        </TimestampContainer>
      </MessageContent>
    </MessageContainer>
  );
};

export default Message;