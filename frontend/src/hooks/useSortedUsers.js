import { useMemo } from "react";
import { useUsers, useUnseenMessages } from "../services/store";

const useSortedUsers = () => {
  const users = useUsers();
  const unseenMessages = useUnseenMessages();

  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => {
      const unseenA = unseenMessages[a.ID] || 0;
      const unseenB = unseenMessages[b.ID] || 0;
      if (unseenA > unseenB) return -1;
      if (unseenA < unseenB) return 1;
      const statusPriority = {
        "is picking emoji...": 0,
        "is typing...": 1,
        Online: 2,
        Offline: 3,
      };
      const statusA = statusPriority[a.status] ?? 4;
      const statusB = statusPriority[b.status] ?? 4;
      if (statusA < statusB) return -1;
      if (statusA > statusB) return 1;
      return a.username.localeCompare(b.username);
    });
  }, [users, unseenMessages]);

  return sortedUsers;
};

export default useSortedUsers;
