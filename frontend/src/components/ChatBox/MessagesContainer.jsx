import React, { useEffect, useRef } from "react";
import { useUnseenMessages } from "../../services/store";
import Message from "../Message";
import { MessagesWrapper } from "./Style";

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

export default MessagesContainer;
