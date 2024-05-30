import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import { useToken } from "./services/store";


const App = () => {
  const token = useToken();

  return (
    <div style={{ padding: 0, margin: 0, width: "100%", height: "100%" }}>
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={token ? <Navigate to="/chat" /> : <AuthPage />}
          />
          <Route
            path="/chat"
            element={token ? <ChatPage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
