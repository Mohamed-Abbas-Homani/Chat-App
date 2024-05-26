import React, { useState } from "react";
import { useUser } from "../../services/store";
import humanReadableTimeDifference from "../../helpers/timeHelper";
import { FaSearch, FaArrowUp, FaArrowDown, FaTimes } from "react-icons/fa"; // Import arrow icons
import {
  TopBarContainer,
  UserAvatar,
  UserInfo,
  Username,
  UserStatus,
  SearchIcon,
  SearchForm,
  SearchInput,
  IconButton,
  ArrowButtonWrapper,
  ArrowButton, // New styled component for arrow buttons
} from "./Style";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
const TopBar = ({
  recipient,
  onAvatarClick,
  onSearch,
  setSearchResult,
  searchResult,
  searchInput,
  setSearchInput
}) => {
  const currentUser = useUser();
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchInput("");
    setSearchResult({results:[], pos:0})
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
      {!searchVisible && <SearchIcon onClick={toggleSearch} />}
      {searchVisible && (
        <SearchForm onSubmit={handleSearch}>
        {!!searchResult.results.length && <ArrowButtonWrapper>
            <ArrowButton
              type="button"
              onClick={() => {
                setSearchResult({
                  ...searchResult,
                  pos: searchResult.results[searchResult.pos - 1]
                    ? searchResult.pos - 1
                    : searchResult.pos ,
                });
              }}
            >
              <IoIosArrowUp />
            </ArrowButton>
            <small style={{ position:"absolute"}}>
              { searchResult.pos + 1}
            </small>
            <ArrowButton
              type="button"
              onClick={() => {
                setSearchResult({
                  ...searchResult,
                  pos: searchResult.results[searchResult.pos + 1]
                    ? searchResult.pos + 1
                    : searchResult.pos ,
                });
              }}
            >
              <IoIosArrowDown />
            </ArrowButton>
          </ArrowButtonWrapper>}
          <SearchInput
            type="text"
            placeholder="Search messages"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <IconButton type="submit">
            <FaSearch />
          </IconButton>
          <IconButton type="button" onClick={toggleSearch}>
            <FaTimes />
          </IconButton>
        </SearchForm>
      )}
    </TopBarContainer>
  );
};

export default TopBar;
