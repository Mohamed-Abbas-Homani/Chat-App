// commonStyles.js
import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#333" : "#f0f2f5")};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ $isDarkMode }) => ($isDarkMode ? "#444" : "white")};
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${({ $isDarkMode }) => ($isDarkMode ? "0 4px 8px rgba(0, 0, 0, 0.5)" : "0 4px 8px rgba(0, 0, 0, 0.1)")};
`;

export const Input = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  border: 1px solid ${({ error, $isDarkMode }) => (error ? "red" : $isDarkMode ? "#555" : "#ccc")};
  width: 200px;
  background-color: transparent;
  color: ${({ $isDarkMode }) => ($isDarkMode ? "#fff" : "#000")};
`;

export const Button = styled.button`
  font-weight: bold;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#66bb6a" : "#4caf50")};
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#5da048" : "#45a049")};
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8em;
  margin: -5px 0 10px 0;
`;

export const BackendErrorMessage = styled.p`
  color: red;
  font-size: 1em;
  margin: 10px 0;
`;

export const FileInputLabel = styled.label`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
  height: 50px;
  text-align: center;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? "#5da048" : "#45a049")};
  &:hover {
    filter: brightness(1.1);
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const CancelButton = styled.span`
  margin-left: 10px;
  color: white;
  cursor: pointer;
  font-size: 2em;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`;

export const UserAvatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;
