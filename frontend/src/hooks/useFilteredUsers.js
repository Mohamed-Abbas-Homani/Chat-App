// hooks/useFilteredUsers.js
import { useMemo, useState } from "react";
import useSortedUsers from "./useSortedUsers";
import { useUnseenMessages } from "../services/store";

const useFilteredUsers = () => {
  const sortedUsers = useSortedUsers();
  const unseenMessages = useUnseenMessages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    showOffline: true,
    showUnseen: false,
  });

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) => {
      const matchesSearch = user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesOnlineStatus =
        filterOptions.showOffline || user.status === "Online";
      const matchesUnseenStatus =
        !filterOptions.showUnseen || unseenMessages[user.ID] > 0;
      return matchesSearch && matchesOnlineStatus && matchesUnseenStatus;
    });
  }, [sortedUsers, searchTerm, filterOptions, unseenMessages]);

  const handleFilterChange = (option, value) => {
    setFilterOptions((prev) => ({ ...prev, [option]: value }));
  };

  return { filteredUsers, searchTerm, setSearchTerm, filterOptions, handleFilterChange };
};

export default useFilteredUsers;
