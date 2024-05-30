import { useUnseenMessages } from "../../services/store";
import { UserAvatar, UserInfo, UnseenMessageCounter } from "./Style";
import { UserItemContainer, UserStatus, Username } from "./Style";

const UserItem = ({ user, selected, onClick, currentUser }) => {
  const unseenMessages = useUnseenMessages();
  const avatarUrl =
    (currentUser.ID == user.ID
      ? currentUser.profile_picture
      : user?.profile_picture) ?? "uploads/default.jpg";
  return (
    <UserItemContainer selected={selected} onClick={onClick}>
      <UserAvatar src={`http://localhost:8080/${avatarUrl}`} alt="Profile" />
      <UserInfo>
        <Username>
          {user.username}
          {user.ID === currentUser.ID ? "(You)" : ""}
        </Username>
        <UserStatus
          $online={user.status !== "Offline" || currentUser.ID === user.ID}
        >
          {currentUser.ID === user.ID ? "Online" : user.status}
        </UserStatus>
      </UserInfo>
      {unseenMessages[user.ID] > 0 && (
        <UnseenMessageCounter>{unseenMessages[user.ID]}</UnseenMessageCounter>
      )}
    </UserItemContainer>
  );
};

export default UserItem;
