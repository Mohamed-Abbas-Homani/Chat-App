// commonStyles.js
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${({ error }) => (error ? "red" : "#ccc")};
  width: 200px;
`;

export const Button = styled.button`
  font-weight: bold;
  margin: 10px;
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
  background-color: #45a049;
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
