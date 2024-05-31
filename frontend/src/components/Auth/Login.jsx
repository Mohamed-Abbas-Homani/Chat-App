// Login.jsx
import React from "react";
import {
  Container,
  Form,
  Input,
  Button,
  ErrorMessage,
} from "./Style";
import useLogin from "../../hooks/useLogin";
import { useIsDarkMode } from "../../services/store";

const Login = ({ isLogin, setIsLogin }) => {
  const isDarkMode = useIsDarkMode();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    clientError,
    handleSubmit,
  } = useLogin();

  return (
    <Container $isDarkMode={isDarkMode}>
      <Form $isDarkMode={isDarkMode} onSubmit={handleSubmit}>
        <h2 style={{ color: isDarkMode ? "#66bb6a" : "#4caf50" }}>Login</h2>
        {clientError && <ErrorMessage>{clientError}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          $isDarkMode={isDarkMode}
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          $isDarkMode={isDarkMode}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button $isDarkMode={isDarkMode} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </Button>
          <Button $isDarkMode={isDarkMode} type="submit">Login</Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
