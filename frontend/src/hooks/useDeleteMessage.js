import axios from 'axios';
import { useDeleteMsg, useToken } from "../services/store";

const useDeleteMessage = () => {
  const deleteMsg = useDeleteMsg()
  const token = useToken()
  const deleteMessage = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/message/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      deleteMsg(id)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return { deleteMessage };
};

export default useDeleteMessage;
