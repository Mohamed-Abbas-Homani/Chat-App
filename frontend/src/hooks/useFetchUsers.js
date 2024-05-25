import { useSetUsers } from "../services/store";

const useFetchUsers = () => {
  const setUsers = useSetUsers();

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:8080/user/");
    const res = await response.json();
    setUsers([{ ID: 0, username: "Everyone" }, ...res]);
  };

  return { fetchUsers };
};

export default useFetchUsers;
