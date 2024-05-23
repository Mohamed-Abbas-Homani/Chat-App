import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ width: "100%", height: "100%", padding: 0, margin: 0 }}>
      {isLogin ? (
        <Login isLogin={isLogin} setIsLogin={setIsLogin} />
      ) : (
        <Signup isLogin={isLogin} setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default AuthPage;
