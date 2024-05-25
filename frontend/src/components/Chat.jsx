import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";

import styled from "styled-components";
import {
  useAddMessage,
  useAddUnseenMsg,
  useMarkDelivredMsg,
  useMarkSeenMsg,
  useMessages,
  useRecipient,
  useResetUnseenMsg,
  useSetMessages,
  useSetUsers,
  useSetWs,
  useToken,
  useUnseenMessages,
  useUser,
  useUsers,
  useWs,
} from "../services/store";
import UserList from "./UserList/UserList";
const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Chat = () => {
  const setUsers = useSetUsers();
  const users = useUsers();
  const currentUser = useUser();
  const token = useToken();
  const setMessages = useSetMessages();
  const messages = useMessages();
  const unseenMessages = useUnseenMessages();
  const addMessage = useAddMessage();
  const recipient = useRecipient();
  const [ws, setWs] = useState(null);
  const addUnseenMsg = useAddUnseenMsg();
  const markDelivredMsg = useMarkDelivredMsg();
  const markSeenMsg = useMarkSeenMsg();
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
      const socket = !!!ws
        ? new WebSocket(`ws://localhost:8000/ws?token=${token}`)
        : ws;

      socket.onopen = () => {
        console.log("WebSocket connected");
        setWs(socket);
      };
      setWs(socket);
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.message_type) {
          case "chat":
            console.log("chat message : \n", message);
            if (
              message.sender_id != currentUser.ID &&
              message.status == "sent"
            ) {
              // if (recipient.ID == message.sender_id) {
              //   console.log("hi")
              //   socket.send(
              //     JSON.stringify({
              //       message_type: "status",
              //       status: "seen",
              //       sender_id: recipient.ID,
              //       recipient_id: currentUser.ID,
              //     })
              //   );
              // }else {
              message.status = "delivred";
              addUnseenMsg(message.sender_id);
              message.message_type = "status";
              socket.send(JSON.stringify(message));
              message.message_type = "chat";
              
            }
            if (!messages.filter((m) => m.ID == message.ID).length)
              addMessage(message);
            break;
          case "system":
            console.log("System message : \n", message);
            setUsers([
              ...users.map((u) => {
                if (u.ID == message.sender_id) {
                  u.status = message.content;
                  console.log(u.status);
                }
                return u;
              }),
            ]);
            break;

          case "status":
            console.log("status message : \n", message);
            if (message.status == "delivred") {
              markDelivredMsg(message);
            } else {
              markSeenMsg(message, currentUser.ID);
            }
            break;
          default:
            break;
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
          console.log("finish")
          socket.close();
        }
      };
    }
  }, [token]);

  const sendMessage = (msg) => {
    if (ws) {
      ws.send(JSON.stringify(msg));
    }
  };

  return (
    <ChatPageContainer style={{ display: "flex" }}>
      <UserList />
      {recipient && recipient.ID && <ChatBox sendMessage={sendMessage} />}
    </ChatPageContainer>
  );
};

export default Chat;
