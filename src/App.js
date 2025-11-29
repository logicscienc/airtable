import "./App.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard"; // create this

function App() {
  return (
    <div>
      <Navbar />
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />

        {/* ADD THIS */}
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;


