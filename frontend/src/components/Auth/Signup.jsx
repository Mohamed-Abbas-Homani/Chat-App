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
import { useIsDarkMode } from "../../services/store";

const Signup = ({ isLogin, setIsLogin }) => {
  const isDarkMode = useIsDarkMode()
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
    <Container $isDarkMode={isDarkMode}>
      <Form onSubmit={handleSubmit} $isDarkMode={isDarkMode}>
        <h2 style={{ color: "#4caf50" }}>Signup</h2>
        <Input
        $isDarkMode={isDarkMode}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        <Input
        $isDarkMode={isDarkMode}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        <Input
        $isDarkMode={isDarkMode}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <FileInputLabel $isDarkMode={isDarkMode}>
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
          <Button type="button" onClick={() => setIsLogin(!isLogin)} $isDarkMode={isDarkMode}>
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </Button>
          <Button type="submit" $isDarkMode={isDarkMode}>Sign Up</Button>
        </div>
      </Form>
    </Container>
  );
};

export default Signup;
