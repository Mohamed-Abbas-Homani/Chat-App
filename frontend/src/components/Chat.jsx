// Chat.jsx
import React, { useEffect } from "react";
import styled from "styled-components";
import ChatBox from "./ChatBox/ChatBox";
import UserList from "./UserList/UserList";
import useWebSocket from "../hooks/useWebSocket";
import { useToken, useUsers, useRecipient, useUpdateRecipient, useUpdateUserStatus, useMessages, useDeleteMsg, useMarkSeenMsg, useMarkDelivredMsg, useAddUnseenMsg, useAddMessage, useUser } from "../services/store";

const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Chat = () => {
  const token = useToken();
  const users = useUsers();
  const recipient = useRecipient();
  const { ws, sendMessage, closeWebSocket } = useWebSocket(token);
  const currentUser = useUser();
  const addMessage = useAddMessage();
  const addUnseenMsg = useAddUnseenMsg();
  const markDelivredMsg = useMarkDelivredMsg();
  const markSeenMsg = useMarkSeenMsg();
  const messages = useMessages();
  const updateRecipient = useUpdateRecipient();
  const updateUserStatus = useUpdateUserStatus();
  const deleteMsg = useDeleteMsg();
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
      };
    }
    return () => closeWebSocket();
  }, [ws]);
  const handleMessage = (message) => {
    switch (message.message_type) {
      case "chat":
        handleChatMessage(message);
        break;
      case "system":
        handleSystemMessage(message);
        break;
      case "status":
        handleStatusMessage(message);
        break;
      default:
        break;
    }
  };

  const handleChatMessage = (message) => {
    if (message.sender_id !== currentUser.ID && message.status === "sent") {
      message.status = "delivered";
      addUnseenMsg(message.sender_id);
      sendMessage({ ...message, message_type: "status" });
    }
    if (!messages.some((m) => m.ID === message.ID)) {
      addMessage(message);
    }
  };

  const handleSystemMessage = (message) => {
    if (recipient.ID == message.sender_id) {
      updateRecipient({
        status: message.content,
        last_seen: message.status,
      });
    }

    updateUserStatus(message)
 
    
  };

  const handleStatusMessage = (message) => {
    if (message.status === "deleted"){
      deleteMsg(message.ID)
    }
    else  if (message.status === "delivered") {
      markDelivredMsg(message);
    } else {
      markSeenMsg(message, currentUser.ID);
    }
  };
  return (
    <ChatPageContainer>
      <UserList users={users} />
      {!!recipient && !!recipient.ID && <ChatBox sendMessage={sendMessage} />}
    </ChatPageContainer>
  );
};

export default Chat;
