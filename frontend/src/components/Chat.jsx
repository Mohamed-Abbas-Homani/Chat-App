import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ChatBox from "./ChatBox/ChatBox";
import UserList from "./UserList/UserList";
import useWebSocket from "../hooks/useWebSocket";
import useFetchUsers from "../hooks/useFetchUsers";
import {
  useAddMessage,
  useAddUnseenMsg,
  useDeleteMsg,
  useMarkDelivredMsg,
  useMarkSeenMsg,
  useMessages,
  useRecipient,
  useSetRecipient,
  useSetUsers,
  useToken,
  useUpdateRecipient,
  useUpdateUserStatus,
  useUser,
  useUsers,
} from "../services/store";

const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Chat = () => {
  const token = useToken();
  const currentUser = useUser();
  const addMessage = useAddMessage();
  const addUnseenMsg = useAddUnseenMsg();
  const markDelivredMsg = useMarkDelivredMsg();
  const markSeenMsg = useMarkSeenMsg();
  const messages = useMessages();
  const recipient = useRecipient();
  const users = useUsers();
  const setUsers = useSetUsers();
  const { fetchUsers } = useFetchUsers();
  const { ws, sendMessage, closeWebSocket } = useWebSocket(token);
  const updateRecipient = useUpdateRecipient()
  const updateUser = useUpdateUserStatus()
  const deleteMsg = useDeleteMsg()
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
      };
    }
    return () => closeWebSocket();
  }, [ws, token]);

  const handleMessage = (message) => {
    switch (message.message_type) {
      case "chat":
        handleChatMessage(message);
        break;
      case "system":
        console.log(message);
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
      message.status = "delivred";
      addUnseenMsg(message.sender_id);
      sendMessage({ ...message, message_type: "status" });
    }
    if (!messages.some((m) => m.ID === message.ID)) {
      addMessage(message);
    }
  };

  const handleSystemMessage = (message) => {
    if (recipient.ID == message.sender_id) {
      console.log("asdf")
      updateRecipient({
        status: message.content,
        last_seen: message.status,
      });
    }

    updateUser(message)
    // setUsers([
    //   ...users.map((u) => {
    //     if (u.ID == message.sender_id) {
    //       u.status = message.content;
    //       u.last_seen = message.status;
    //     }
    //     return u;
    //   }),
    // ]);
    
  };

  const handleStatusMessage = (message) => {
    if (message.status === "deleted"){
      console.log("delted", message)
      deleteMsg(message.ID)
    }
    else  if (message.status === "delivred") {
      markDelivredMsg(message);
    } else {
      markSeenMsg(message, currentUser.ID);
    }
  };
  useEffect(() => {
  fetchUsers();
  }, [token]);
  return (
    <ChatPageContainer>
      {!!users.length && <UserList users={users}/>}
      {!!recipient && !!recipient.ID && <ChatBox sendMessage={sendMessage} />}
    </ChatPageContainer>
  );
};

export default Chat;
