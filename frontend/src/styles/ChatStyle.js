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

export const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
  margin-bottom: 20px;
`;

export const Message = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  background: #f1f1f1;
`;

export const ChatForm = styled.form`
  display: flex;
`;

export const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export const ChatButton = styled.button`
  margin-left: 10px;
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
