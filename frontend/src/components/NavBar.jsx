import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  useToken,
  useSetLogout,
  useSetMessages,
} from "../services/store";

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 13px;
  background-color: #4caf50;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  font-weight: bold;
  color: white;
  text-decoration: none;
  margin: 0 10px;
  font-size: 1.1em;
  transition: 0.3s all;
  &:hover {
    transform: scale(1.03);
  }
`;

const Logo = styled.h1`
  font-size: 1.5em;
  margin: 0;
`;

const AuthButton = styled.button`
  color: #4caf50;
  background-color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1em;
  margin: 0 10px;
  transition: 0.3s all;
  &:hover {
    transform: scale(1.03);
  }
`;

const NavBar = () => {
  const token = useToken();
  const setLogout = useSetLogout();
  const setMessages = useSetMessages();

  const handleLogout = () => {
    setLogout();
  };

  return (
    <NavBarContainer>
      <Logo>ChatApp</Logo>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {token ? (
          <AuthButton onClick={handleLogout}>
            Logout
          </AuthButton>
        ) : (
          <NavLink to="/auth">Login</NavLink>
        )}
      </NavLinks>
    </NavBarContainer>
  );
};

export default NavBar;
