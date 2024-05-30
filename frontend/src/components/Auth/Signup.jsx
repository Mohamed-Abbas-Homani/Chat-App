// Signup.jsx
import React from "react";
import {
  Container,
  Form,
  Input,
  Button,
  ErrorMessage,
  BackendErrorMessage,
  FileInputLabel,
  HiddenFileInput,
  CancelButton,
  UserAvatar,
} from "./Style";
import useSignup from "../../hooks/useSignup";

const Signup = ({ isLogin, setIsLogin }) => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    profilePicture,
    preview,
    errors,
    backendError,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
  } = useSignup(setIsLogin);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ color: "#4caf50" }}>Signup</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <FileInputLabel>
          {preview ? (
            <>
              <UserAvatar src={preview} />
              {profilePicture?.name}
              <CancelButton onClick={handleRemoveImage}>&times;</CancelButton>
            </>
          ) : (
            "Enter profile picture"
          )}
          <HiddenFileInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </FileInputLabel>
        {backendError && <BackendErrorMessage>{backendError}</BackendErrorMessage>}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </Button>
          <Button type="submit">Sign Up</Button>
        </div>
      </Form>
    </Container>
  );
};

export default Signup;
