import styled from "styled-components";

export const UserItemContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  background: ${(props) => (props.selected ? "#4caf50" : props.$isDarkMode ? "#333" : "white")};
  color: ${(props) => (props.selected ? "white" : props.$isDarkMode ? "#ccc" : "black")};
  margin: 5px 0;
  transition: background 0.3s;

  &:hover {
    background: ${(props) => (props.selected ? "#45a049" : props.$isDarkMode ? "#555" : "#ddd")};
  }
`;

export const UserAvatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
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
  color: ${(props) => (props.$online ? "#4caf50" : props.$isDarkMode ? "#bbb" : "#888")};
`;

export const UnseenMessageCounter = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #4caf50;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
`;

export const UserListContainer = styled.div`
position: relative;
  width: 30%;
  padding: 20px;
  background: ${(props) => (props.$isDarkMode ? "#222" : "#f0f2f5")};
  border-right: ${(props) => (props.$isDarkMode ? "1px solid #444" : "1px solid #ddd")};
  color: ${(props) => (props.$isDarkMode ? "#ccc" : "black")};
`;

export const UserScrollContainer = styled.div`
  max-height: 75vh; /* Adjust height as needed */
  overflow-y: auto;
`;

export const DarkModeButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

export const SearchBar = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  border: none;
  margin-bottom: 10px;
  background: ${(props) => (props.$isDarkMode ? "#333" : "#f0f2f5")};
  color: ${(props) => (props.$isDarkMode ? "#ccc" : "black")};
  box-shadow: inset 3px 3px 3px ${(props) => (props.$isDarkMode ? "#222" : "#ccced0")},
    inset -3px -3px 3px ${(props) => (props.$isDarkMode ? "#444" : "#ffffff")};
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const CheckboxLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

export const CheckboxInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Checkmark = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: ${(props) => (props.$isDarkMode ? "#333" : "#f0f2f5")};
  border-radius: 50%;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
