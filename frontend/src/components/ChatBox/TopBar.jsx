import React, { useState } from "react";
import { useUser } from "../../services/store";
import humanReadableTimeDifference from "../../helpers/timeHelper";
import {
  TopBarContainer,
  UserAvatar,
  UserInfo,
  Username,
  UserStatus,
  LastSeen,
  ButtonSearch,
} from "./Style";

const TopBar = ({ recipient, onAvatarClick, onSearch }) => {
  const currentUser = useUser();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <TopBarContainer>
      <UserAvatar
        src={`http://localhost:8080/${
          recipient.profile_picture || "uploads/default.jpg"
        }`}
        alt="Profile"
        onClick={onAvatarClick}
      />
      <UserInfo>
        <Username>
          {recipient.username}
          {currentUser.ID === recipient.ID ? "(You)" : ""}
        </Username>
        <UserStatus
          $online={
            recipient.status !== "Offline" || currentUser.ID === recipient.ID
          }
        >
          {currentUser.ID === recipient.ID ? "Online" : recipient.status}
          {recipient.status === "Offline" &&
            ` ~ ${humanReadableTimeDifference(recipient.last_seen)}`}
        </UserStatus>
      </UserInfo>
      <form
        onSubmit={handleSearch}
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          marginRight: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search messages"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: "5px", marginRight: "5px", borderRadius: "5px" }}
        />
        <ButtonSearch type="submit">Search</ButtonSearch>
      </form>
    </TopBarContainer>
  );
};

export default TopBar;
