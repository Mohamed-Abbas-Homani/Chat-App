import React, { useEffect } from "react";
import {
  useSetRecipient,
  useUser,
  useRecipient,
  useToken,
} from "../../services/store";
import { UserListContainer, UserScrollContainer } from "./Style";
import SearchAndFilter from "./SearchAndFilter";
import UserItem from "./UserItem";
import useFetchUsers from "../../hooks/useFetchUsers";
import useFilteredUsers from "../../hooks/useFilteredUsers";

const UserList = () => {
  const token = useToken();
  const { fetchUsers } = useFetchUsers();
  const setRecipient = useSetRecipient();
  const currentUser = useUser();
  const recipient = useRecipient();
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
  } = useFilteredUsers();

  useEffect(() => {
    (async () => await fetchUsers())();
  }, [token]);

  return (
    <UserListContainer>
      <h2 style={{ color: "#4caf50", marginBottom: "13px" }}>Users</h2>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      <UserScrollContainer>
        {filteredUsers.map((user) => (
          <UserItem
            key={user.ID}
            user={user}
            selected={recipient?.ID === user.ID}
            onClick={() => setRecipient(user)}
            currentUser={currentUser}
          />
        ))}
      </UserScrollContainer>
    </UserListContainer>
  );
};

export default UserList;
