import styled from "styled-components";

export const UserItemContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  background: ${(props) => (props.selected ? "#4caf50" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
  margin: 5px 0;
  transition: background 0.3s;

  &:hover {
    background: ${(props) => (props.selected ? "#45a049" : "#ddd")};
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
  color: ${(props) => (props.$online ? "#4caf50" : "#888")};
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
  width: 30%;
  padding: 20px;
  background: #f0f2f5;
  border-right: 1px solid #ddd;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SearchBar = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
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
  background-color: #f0f2f5;
  border-radius: 50%;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
