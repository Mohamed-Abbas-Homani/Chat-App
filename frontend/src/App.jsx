import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import { useSetLogin, useStore, useToken, useUser } from "./services/store";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Cookies from "js-cookie";

const App = () => {
  const token = useToken();

  return (
    <div style={{ padding: 0, margin: 0, width: "100%", height: "100%" }}>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={token ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={token ? <Navigate to="/" /> : <AuthPage />}
          />
          <Route
            path="/chat"
            element={token ? <ChatPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={token ? <ProfilePage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
