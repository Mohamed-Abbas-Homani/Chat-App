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

  @media (max-width: 600px) {
    padding: 8px;
    margin: 4px 0;
  }
`;

export const UserAvatar = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;

  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Username = styled.span`
  font-weight: bold;

  @media (max-width: 600px) {
    font-size: 0.9em;
  }
`;

export const UserStatus = styled.span`
  font-size: 0.9em;
  color: ${(props) => (props.$online ? "#4caf50" : props.$isDarkMode ? "#bbb" : "#888")};

  @media (max-width: 600px) {
    font-size: 0.8em;
  }
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

  @media (max-width: 600px) {
    width: 18px;
    height: 18px;
    font-size: 0.7em;
    top: 6px;
    right: 6px;
  }
`;

export const UserListContainer = styled.div`
  position: relative;
  width: 30%;
  padding: 20px;
  background: ${(props) => (props.$isDarkMode ? "#222" : "#f0f2f5")};
  border-right: ${(props) => (props.$isDarkMode ? "1px solid #444" : "1px solid #ddd")};
  color: ${(props) => (props.$isDarkMode ? "#ccc" : "black")};

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
`;

export const UserScrollContainer = styled.div`
  max-height: 75vh; /* Adjust height as needed */
  overflow-y: auto;

  @media (max-width: 600px) {
    max-height: 70vh; /* Adjust height for smaller screens */
  }
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

  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
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

  @media (max-width: 600px) {
    margin-bottom: 5px;
    padding: 8px;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    margin-bottom: 5px;
  }
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

  @media (max-width: 600px) {
    width: 18px;
    height: 18px;
    margin: 4px;
  }
`;
