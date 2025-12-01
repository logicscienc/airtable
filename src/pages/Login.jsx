import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import air from "../assert/airtable.png";

export default function Login() {
  const navigate = useNavigate();

 const handleLogin = async () => {
  try {
    window.location.href = "https://airtablebackend-wrf0.onrender.com/api/v1/auth/login";
  } catch (err) {
    console.error(err);
    toast.error("Login failed. Please try again.");
  }
};


  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to top right, #FFBFCA, #FFE7EB)" }}
    >
      <button
        onClick={handleLogin}
        className="flex items-center gap-4 px-8 sm:px-10 py-4 sm:py-5 bg-[#FA1239] text-white text-lg sm:text-xl font-bold rounded-lg shadow-lg hover:opacity-90 transition"
      >
        <img
          src={air}
          alt="Airtable Logo"
          className="w-fit h-fit sm:w-10 sm:h-10"
        />
        <span>Login with Airtable</span>
      </button>
    </div>
  );
}


