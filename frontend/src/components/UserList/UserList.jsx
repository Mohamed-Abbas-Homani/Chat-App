import React, { useState, useMemo } from "react";
import {
  useRecipient,
  useSetRecipient,
  useUser,
  useUsers,
  useUnseenMessages,
} from "../../services/store";
import { UserListContainer } from "./Style";
import SearchAndFilter from "./SearchAndFilter";
import UserItem from "./UserItem";

const UserList = () => {
  const users = useUsers();
  const unseenMessages = useUnseenMessages();
  const currentUser = useUser();
  const setRecipient = useSetRecipient();
  const recipient = useRecipient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    showOffline: true,
    showUnseen: false,
  });

  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => {
      const unseenA = unseenMessages[a.ID] || 0;
      const unseenB = unseenMessages[b.ID] || 0;
      if (unseenA > unseenB) return -1;
      if (unseenA < unseenB) return 1;
      const statusPriority = { "is picking emoji...": 0, "is typing...": 1, "Online": 2, "Offline": 3 };
      const statusA = statusPriority[a.status] ?? 4;
      const statusB = statusPriority[b.status] ?? 4;
      if (statusA < statusB) return -1;
      if (statusA > statusB) return 1;
      return a.username.localeCompare(b.username);
    });
  }, [users, unseenMessages]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOnlineStatus = filterOptions.showOffline || user.status === "Online";
      const matchesUnseenStatus = !filterOptions.showUnseen || unseenMessages[user.ID] > 0;
      return matchesSearch && matchesOnlineStatus && matchesUnseenStatus;
    });
  }, [sortedUsers, searchTerm, filterOptions, unseenMessages]);

  const handleFilterChange = (option, value) => {
    setFilterOptions((prev) => ({ ...prev, [option]: value }));
  };

  return (
    <UserListContainer>
      <h2 style={{ color: "#4caf50", marginBottom: "13px" }}>Users</h2>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      {filteredUsers.map((user, index) => (
        <UserItem
          key={index}
          user={user}
          selected={recipient?.ID === user.ID}
          onClick={() => setRecipient(user)}
          currentUser={currentUser}
        />
      ))}
    </UserListContainer>
  );
};

export default UserList;
