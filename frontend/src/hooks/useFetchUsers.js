import axios from 'axios';
import { useSetUsers, useToken } from "../services/store";

const useFetchUsers = () => {
  const setUsers = useSetUsers();
  const token = useToken()
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return { fetchUsers };
};

export default useFetchUsers;
