import "./App.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard"; 
import Edit from "./components/Edit";
import View from "./components/View";
import Responses from "./components/Responses";

function App() {
  return (
    <div>
      <Navbar />
      <Toaster position="top-right" />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Form Routes */}
        <Route path="/form/:formId" element={<View />} />       
        <Route path="/form/:formId/edit" element={<Edit />} /> 
         {/* Edit form */}

         <Route path="/form/:formId/responses" element={<Responses />} />
      </Routes>
    </div>
  );
}

export default App;



