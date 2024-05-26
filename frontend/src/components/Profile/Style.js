import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const Avatar = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

export const Username = styled.h2`
  margin-bottom: 10px;
`;

export const Email = styled.p`
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
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
