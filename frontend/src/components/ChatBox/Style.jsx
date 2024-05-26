import styled from "styled-components";

export const Modal = styled.div`
  display: ${(props) => (props.$show ? "block" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);
`;

export const ModalContent = styled.div`
  margin: 10% auto;
  padding: 20px;
  width: 90%;
  max-width: 700px;
  background-color: white;
  border-radius: 10px;
  position: relative;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  @media (max-width: 600px) {
    width: 95%;
    padding: 15px;
  }
`;

export const ModalClose = styled.span`
  position: absolute;
  top: -15px;
  right: 1px;
  color: #aaa;
  font-size: 35px;
  font-weight: bold;
  cursor: pointer;
  &:hover,
  &:focus {
    color: #4caf50;
    text-decoration: none;
  }
`;

export const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 1em;
  &:hover {
    background-color: #45a049;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 15px 0;
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
`;

export const DownloadLink = styled.a`
  display: block;
  margin-top: 10px;
  color: #4caf50;
  text-decoration: none;
  &:hover {
    color: #388e3c;
  }
`;

export const LastSeen = styled.span`
  font-size: 0.9em;
  color: #888;
`;

export const MessagesWrapper = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
  margin-bottom: 20px;
`;

export const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f8f9fa;
  position: relative;
`;

export const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border-radius: 13px;
  border: 1px solid #ccc;
  resize: none;
  outline: none;
  margin-right: 10px;
  height: 40px;
  &:focus {
    border-color: #4caf50;
  }
`;

export const EmojiPickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 20px;
  bottom: 70px;
  width: 89%;
  max-width: 550px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
  user-select: none;
`;

export const CategoryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 10px;
  user-select: none;
`;

export const CategoryButton = styled.button`
  background-color: ${(props) => (props.$active ? "#4caf50" : "#f0f0f0")};
  color: ${(props) => (props.$active ? "white" : "black")};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
  &:hover {
    background-color: ${(props) => (props.$active ? "#45a049" : "#e0e0e0")};
  }
  user-select: none;
`;

export const EmojisWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 200px;
  overflow-y: scroll;
  user-select: none;
`;

export const EmojiButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4caf5090;
  margin: 5px;
  width: ${(props) => (props.$isKaomoji ? "100px" : "40px")};
  height: ${(props) => (props.$isKaomoji ? "100px" : "40px")};
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: ${(props) => (props.$isKaomoji ? "1em" : "1.5em")};
  &:hover {
    filter: brightness(1.1);
  }
  user-select: none;
`;

import { FaSearch } from "react-icons/fa";

export const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const UserAvatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Username = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  color: #333;
`;

export const UserStatus = styled.span`
  font-size: 0.9em;
  color: ${(props) => (props.$online ? "#4caf50" : "#888")};
`;

export const SearchIcon = styled(FaSearch)`
  margin-left: auto;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
  &:hover {
    color: #4caf50;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  position: absolute;
  right: 20px;
`;

export const SearchInput = styled.input`
  padding: 10px;
  outline: none;
  border: none;
  margin-right: 5px;
  transition: all 1s ease;
  border-radius: 5px;
  background: #f8f9fa;
  box-shadow: inset 4px 4px 5px #d3d4d5, inset -4px -4px 5px #ffffff;
`;

export const IconButton = styled.button`
  font-size: 1.4em;
  margin: 8px;
  color: #333;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #4caf50;
  }
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 70%;
  border-left: 1px solid #ddd;
  padding: 0px;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

export const SendButton = styled.button`
  padding: 15px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#4caf50")};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#ccc" : "#45a049"};
  }
`;

export const EmojiButtonWrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  font-size: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
  outline: none;
  &:hover {
    transform: scale(1.2) rotate(5deg);
  }
`;

export const ArrowButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const ArrowButton = styled.button`
  margin: 7px;
  color: #333;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #4caf50;
    transform: scale(1.1);
  }
`;
