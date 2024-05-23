import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";

import styled from "styled-components";
import {
  useAddMessage,
  useAddUnseenMsg,
  useMessages,
  useRecipient,
  useSetMessages,
  useSetUsers,
  useToken,
  useUnseenMessages,
  useUser,
} from "../services/store";
import UserList from "./UserList/UserList";
const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Chat = () => {
  const setUsers = useSetUsers();
  const currentUser = useUser();
  const token = useToken();
  const setMessages = useSetMessages();
  const messages = useMessages();
  const unseenMessages = useUnseenMessages();
  const addMessage = useAddMessage();
  const recipient = useRecipient();
  const [ws, setWs] = useState(null);
  const addUnseenMsg = useAddUnseenMsg();
  const fetchUsers = async () => {
    const response = await fetch("http://localhost:8080/user/", {
      method: "GET",
    });
    const res = await response.json();
    setUsers([{ ID: 0, username: "Everyone" }, ...res]);
  };
  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (token) {
      
      const socket = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setWs(socket);
      };
      setWs(socket);
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.message_type == "system") fetchUsers();
        else {
          if (!messages.filter((m) => m.ID == message.ID).length) {
            console.log("added");
            addMessage(message);
            if (
              recipient.ID != message.sender_id ||
              message.recipient_id == 0
            ) {
              if (message.recipient_id) addUnseenMsg(message.sender_id);
              else if (message.recipient_id == 0 && recipient.ID != 0)
                addUnseenMsg(0);
            }
          }
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [token]);

  const sendMessage = (messageContent) => {
    if (ws && messageContent && recipient) {
      const message = {
        content: messageContent,
        recipient_id: recipient.ID,
      };
      if (message.recipient_id && message.recipient_id !== currentUser.ID)
        addMessage({
          ...message,
          sender_id: currentUser.ID,
          CreatedAt: new Date(),
        });
      ws.send(JSON.stringify(message));
    }
  };

  return (
    <ChatPageContainer style={{ display: "flex" }}>
      <UserList />
      <ChatBox sendMessage={sendMessage} />
    </ChatPageContainer>
  );
};

export default Chat;
