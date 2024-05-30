// hooks/useHandleMessage.js
import { useCallback } from "react";
import {
  useAddMessage,
  useAddUnseenMsg,
  useDeleteMsg,
  useMarkDelivredMsg,
  useMarkSeenMsg,
  useMessages,
  useRecipient,
  useUser,
  useUpdateRecipient,
  useUpdateUserStatus,
} from "../services/store";

const useHandleMessage = (sendMessage) => {
  const currentUser = useUser();
  const addMessage = useAddMessage();
  const addUnseenMsg = useAddUnseenMsg();
  const markDelivredMsg = useMarkDelivredMsg();
  const markSeenMsg = useMarkSeenMsg();
  const messages = useMessages();
  const recipient = useRecipient();
  const updateRecipient = useUpdateRecipient();
  const updateUserStatus = useUpdateUserStatus();
  const deleteMsg = useDeleteMsg();

  const handleChatMessage = useCallback((message) => {
    if (message.sender_id !== currentUser.ID && message.status === "sent") {
      message.status = "delivred";
      addUnseenMsg(message.sender_id);
      sendMessage({ ...message, message_type: "status" });
    }
    if (!messages.some((m) => m.ID === message.ID)) {
      addMessage(message);
    }
  }, [ currentUser.ID, messages]);

  const handleSystemMessage = useCallback((message) => {
    if (recipient.ID === message.sender_id) {
      updateRecipient({
        status: message.content,
        last_seen: message.status,
      });
    }
    updateUserStatus(message);
  }, [recipient.ID]);

  const handleStatusMessage = useCallback((message) => {
    if (message.status === "deleted") {
      deleteMsg(message.ID);
    } else if (message.status === "delivred") {
      markDelivredMsg(message);
    } else {
      markSeenMsg(message, currentUser.ID);
    }
  }, [currentUser.ID]);

  const handleMessage = useCallback((message) => {
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
  }, []);

  return handleMessage;
};

export default useHandleMessage;
