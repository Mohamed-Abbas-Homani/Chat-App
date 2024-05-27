import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { useSetLogin } from "../services/store";
import Cookies from 'js-cookie';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
`;

const Button = styled.button`
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


const Login = ({ isLogin, setIsLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setLogin = useSetLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      setLogin(user, token);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ color: "#4caf50" }}>Login</h2>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          {" "}
          <Button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </Button>
          <Button type="submit">Login</Button>
        </div>
      </Form>
    </LoginContainer>
  );
};

export default Login;
