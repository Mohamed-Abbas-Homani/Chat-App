import React, { useState } from "react";

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
  const [showOffline, setShowOffline] = useState(true);
  const [showUnseen, setShowUnseen] = useState(false); // Add state for the unseen messages filter

  // Custom sorting function
  const sortUsers = (a, b) => {
    // Sort by unseen messages
    const unseenA = unseenMessages[a.ID] || 0;
    const unseenB = unseenMessages[b.ID] || 0;
    if (unseenA > unseenB) return -1;
    if (unseenA < unseenB) return 1;

    // Then sort by online status
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;

    // Finally, sort by username
    return a.username.localeCompare(b.username);
  };

  const sortedUsers = users.sort(sortUsers);

  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesOnlineStatus = showOffline || user.online;
    const matchesUnseenStatus = !showUnseen || unseenMessages[user.ID] > 0;
    return matchesSearch && matchesOnlineStatus && matchesUnseenStatus;
  });

  return (
    <UserListContainer>
      <h2 style={{ color: "#4caf50", marginBottom: "13px" }}>Users</h2>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showOffline={showOffline}
        setShowOffline={setShowOffline}
        showUnseen={showUnseen} // Pass showUnseen state
        setShowUnseen={setShowUnseen} // Pass setShowUnseen function
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
