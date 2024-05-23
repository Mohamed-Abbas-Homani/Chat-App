import styled from "styled-components";

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 70%;
  border-left: 1px solid #ddd;
  padding: 20px;
`;

export const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

export const UserAvatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Username = styled.span`
  font-weight: bold;
`;

export const UserStatus = styled.span`
  font-size: 0.9em;
  color: ${(props) => (props.$online ? "#4caf50" : "#888")};
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

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TextArea = styled.textarea`
  width: 90%;
  padding: 10px;
  height: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
`;

export const Button = styled.button`
  font-weight: bold;
  margin: 5px;
  width: 8%;
  height: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

export const ButtonSearch = styled.button`
  font-weight: bold;
  margin: 5px;
  height: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

export const EmojiButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4caf5090;
  margin: 5px;
  width: 30px;
  height: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  color: white;
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
`;

export const EmojiPickerWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  right: 1%;
  top: 55%;
`;

export const Modal = styled.div`
  display: ${(props) => (props.$show ? "block" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
`;

export const ModalContent = styled.div`
  margin: 15% auto;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  position: relative;
`;

export const ModalClose = styled.span`
  position: absolute;
  top: 10px;
  right: 25px;
  color: #aaa;
  font-size: 35px;
  font-weight: bold;
  &:hover,
  &:focus {
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }
`;
