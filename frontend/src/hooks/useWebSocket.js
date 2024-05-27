import { useState, useEffect } from "react";

const useWebSocket = (token) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (token) {
      const socket = new WebSocket(`ws://localhost:8000/ws?token=${token}`);
      socket.onopen = () => console.log("WebSocket connected");
      socket.onclose = () => console.log("WebSocket disconnected");
      socket.onerror = (error) => console.error("WebSocket error:", error);
      setWs(socket);
      return () => {
        socket.close();
      };
    }
  }, [token]);

  const sendMessage = (msg) => {
    if (ws) {
      console.log(msg.content)
      ws.send(JSON.stringify(msg));
    }
  };

  const closeWebSocket = () => {
    if (ws) {
      ws.close();
    }
  };

  return { ws, sendMessage, closeWebSocket };
};

export default useWebSocket;
