import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Upload from "./pages/Upload/Upload";
import Management from "./pages/Management/Management";
import ECDH from "./pages/ECDH/ECDH";
import KeyGen from "./pages/KeyGen/KeyGen";
import About from "./pages/About/About";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={ <PrivateRoute><Upload /></PrivateRoute>} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/management" element={<PrivateRoute><Management /></PrivateRoute>} />
            <Route exact path="/ecdh" element={<PrivateRoute><ECDH /></PrivateRoute>} />
            <Route exact path="/keygen" element={<PrivateRoute><KeyGen /></PrivateRoute>} />
            <Route exact path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
