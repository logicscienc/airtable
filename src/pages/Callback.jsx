import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Example URL: http://localhost:3000/callback?token=XYZ
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store token for future API calls
      localStorage.setItem("token", token);

      // Show success toast
      toast.success("Logged in successfully!");

      // Redirect to Dashboard
      navigate("/dashboard");
    } else {
      // Show error if token is missing
      toast.error("Login failed. Please try again.");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center text-xl font-semibold">
      Logging in...
    </div>
  );
}
