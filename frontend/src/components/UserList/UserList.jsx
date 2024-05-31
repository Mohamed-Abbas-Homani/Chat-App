import React, { useEffect, useState } from "react";
import {
  useSetRecipient,
  useUser,
  useRecipient,
  useToken,
  useIsDarkMode,
  useToggleDarkMode,
} from "../../services/store";
import {
  UserListContainer,
  UserScrollContainer,
  DarkModeButton,
} from "./Style";
import SearchAndFilter from "./SearchAndFilter";
import UserItem from "./UserItem";
import useFetchUsers from "../../hooks/useFetchUsers";
import useFilteredUsers from "../../hooks/useFilteredUsers";
import { MdDarkMode, MdLightMode } from "react-icons/md";

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

  const isDarkMode = useIsDarkMode();
  const toggleDarkMode = useToggleDarkMode();
  useEffect(() => {
    (async () => await fetchUsers())();
  }, [token]);

  return (
    <UserListContainer $isDarkMode={isDarkMode}>
      <h2 style={{ color: "#4caf50", marginBottom: "13px" }}>Chats</h2>
      <DarkModeButton onClick={toggleDarkMode}>
        {isDarkMode ? <MdLightMode /> : <MdDarkMode color="#bbb" />}
      </DarkModeButton>
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
