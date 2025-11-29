import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Redirect user to backend OAuth route
      window.location.href = "http://localhost:4000/api/v1/auth/login";
      // Once the backend redirects back with token, you can store it and:
      // localStorage.setItem("token", <token>);
      // toast.success("Logged in successfully!");
      // navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{ background: "linear-gradient(to top right, #FFBFCA, #FFE7EB)" }}>
      <button
        onClick={handleLogin}
        className="px-8 py-4 bg-[#FA1239] text-white text-xl font-bold rounded-lg shadow-lg hover:opacity-90 transition"
      >
        Login with Airtable
      </button>
    </div>
  );
}
