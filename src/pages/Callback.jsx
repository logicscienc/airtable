import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
     
      localStorage.setItem("token", token);

      
      toast.success("Logged in successfully!");

    
      navigate("/dashboard");
    } else {
      
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
