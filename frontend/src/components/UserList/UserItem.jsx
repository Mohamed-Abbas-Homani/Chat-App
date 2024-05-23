import { useUnseenMessages } from "../../services/store";
import { UserAvatar, UserInfo, UnseenMessageCounter } from "./Style"; // Import UnseenMessageCounter
import { UserItemContainer, UserStatus, Username } from "./Style";

const UserItem = ({ user, selected, onClick, currentUser }) => {
  const unseenMessages = useUnseenMessages();
  return (
    <UserItemContainer selected={selected} onClick={onClick}>
      <UserAvatar
        src={`http://localhost:8080/${
          user?.profile_picture ? user.profile_picture : "uploads/default.jpg"
        }`}
        alt="Profile"
      />
      <UserInfo>
        <Username>
          {user.username}
          {user.ID === currentUser.ID ? "(You)" : ""}
        </Username>
        {user.ID !== 0 && (
          <UserStatus $online={user.online}>
            {user.online ? "Online" : "Offline"}
          </UserStatus>
        )}
      </UserInfo>
      {unseenMessages[user.ID] > 0 && (
        <UnseenMessageCounter>
          {unseenMessages[user.ID]}
        </UnseenMessageCounter>
      )}
    </UserItemContainer>
  );
};

export default UserItem;
