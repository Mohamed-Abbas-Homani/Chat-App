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

const Login = ({ isLogin, setIsLogin }) => {
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
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ color: "#4caf50" }}>Login</h2>
        {clientError && <ErrorMessage>{clientError}</ErrorMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
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
          <Button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </Button>
          <Button type="submit">Login</Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
