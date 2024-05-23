import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

export const NavLink = styled(Link)`
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

export const Logo = styled.h1`
  font-size: 1.5em;
  margin: 0;
`;

export const AuthButton = styled.button`
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
