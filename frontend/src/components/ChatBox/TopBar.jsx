import React, { useMemo, useState } from "react";
import { useRecipient, useUser } from "../../services/store";
import humanReadableTimeDifference from "../../helpers/timeHelper";
import { FaSearch, FaTimes } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ProfileModal from "./ProfileModal";
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
  ArrowButton,
} from "./Style";

const TopBar = ({
  onSearch,
  setSearchResult,
  searchResult,
  searchInput,
  setSearchInput,
}) => {
  const recipient = useRecipient();
  const currentUser = useUser();
  const [searchVisible, setSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarUrl =
    currentUser.ID == recipient.ID
      ? currentUser.profile_picture
      : recipient?.profile_picture;
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchInput("");
    setSearchResult({ results: [], pos: 0 });
  };

  const status = useMemo(() => {
    if (currentUser.ID === recipient.ID) {
      return "Online";
    } else {
      if (recipient.status === "Offline") {
        return `Offline ~ ${humanReadableTimeDifference(recipient.last_seen)}`;
      }
    }
    return recipient.status;
  }, [recipient.ID, recipient.status]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <TopBarContainer>
      <UserAvatar
        src={`http://localhost:8080/${
          avatarUrl || "uploads/default.jpg"
        }`}
        alt="Profile"
        onClick={toggleModal}
      />
      <UserInfo onClick={toggleModal}>
        <Username>
          {recipient.username}
          {currentUser.ID === recipient.ID ? "(You)" : ""}
        </Username>
        <UserStatus
          $online={
            recipient.status !== "Offline" || currentUser.ID === recipient.ID
          }
        >
          {status}
        </UserStatus>
      </UserInfo>
      {!searchVisible && <SearchIcon onClick={toggleSearch} />}
      {searchVisible && (
        <SearchForm onSubmit={handleSearch}>
          {!!searchResult.results.length && (
            <ArrowButtonWrapper>
              <ArrowButton
                type="button"
                onClick={() => {
                  setSearchResult({
                    ...searchResult,
                    pos: searchResult.results[searchResult.pos - 1]
                      ? searchResult.pos - 1
                      : searchResult.pos,
                  });
                }}
              >
                <IoIosArrowUp />
              </ArrowButton>
              <small style={{ position: "absolute" }}>
                {searchResult.pos + 1}
              </small>
              <ArrowButton
                type="button"
                onClick={() => {
                  setSearchResult({
                    ...searchResult,
                    pos: searchResult.results[searchResult.pos + 1]
                      ? searchResult.pos + 1
                      : searchResult.pos,
                  });
                }}
              >
                <IoIosArrowDown />
              </ArrowButton>
            </ArrowButtonWrapper>
          )}
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
      <ProfileModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        user={recipient}
      />
    </TopBarContainer>
  );
};

export default TopBar;
