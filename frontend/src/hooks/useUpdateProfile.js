import axios from "axios";
import { useSetLogin, useToken, useUser } from "../services/store";

const useUpdateProfile = () => {
  const token = useToken();
  const setLogin = useSetLogin();
  const id = useUser()["ID"];
  const updateProfile = async (formData) => {
    try {
      const response = await axios.put(
        `http://192.168.1.5:8080/user/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = response.data;
      setLogin(updatedUser, token);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return { updateProfile };
};

export default useUpdateProfile;
