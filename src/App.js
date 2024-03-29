import "./App.css";
import NavigationBar from "./components/Navbar";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AuthProvider } from "./context/authContext.js";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import UserDashboard from "./components/UserDashboard";
import { ProtectedRoute } from "./components/protectedRoute";
import EditRecord from "./components/EditRecord";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" exact element={<Main />} />
          <Route
            path="/massive-whatsapp-sender/signup"
            exact
            element={<Signup />}
          />
          <Route
            path="/massive-whatsapp-sender/login"
            exact
            element={<Login />}
          />
          <Route
            path="/massive-whatsapp-sender/forgotPassword"
            exact
            element={<ForgotPassword />}
          />
          <Route
            path="/massive-whatsapp-sender/userDashboard"
            exact
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/massive-whatsapp-sender/editSavedRecord"
            exact
            element={
              <ProtectedRoute>
                <EditRecord />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
