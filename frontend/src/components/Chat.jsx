// Chat.jsx
import React, { useEffect } from "react";
import styled from "styled-components";
import ChatBox from "./ChatBox/ChatBox";
import UserList from "./UserList/UserList";
import useWebSocket from "../hooks/useWebSocket";
import useHandleMessage from "../hooks/useHandleMessage";
import { useToken, useUsers, useRecipient } from "../services/store";

const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Chat = () => {
  const token = useToken();
  const users = useUsers();
  const recipient = useRecipient();
  const { ws, sendMessage, closeWebSocket } = useWebSocket(token);
  const handleMessage = useHandleMessage(sendMessage);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleMessage(message);
      };
    }
    return () => closeWebSocket();
  }, [ws]);

  return (
    <ChatPageContainer>
      <UserList users={users} />
      {!!recipient && !!recipient.ID && <ChatBox sendMessage={sendMessage} />}
    </ChatPageContainer>
  );
};

export default Chat;
