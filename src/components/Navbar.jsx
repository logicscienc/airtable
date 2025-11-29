import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">

          <Link to="/" className="text-2xl font-bold tracking-wide">
            <span style={{ color: "#FA1239" }}>A</span>
            irForms
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-[#FA1239] font-medium hover:opacity-75">
              Home
            </Link>

            <Link to="/dashboard" className="text-[#FA1239] font-medium hover:opacity-75">
              Dashboard
            </Link>

            {!loggedIn ? (
              <Link
                to="/login"
                className="px-4 py-2 border border-[#FA1239] text-[#FA1239] rounded-md font-medium hover:bg-[#FA1239] hover:text-white transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#FA1239] text-white rounded-md font-medium hover:opacity-80 transition"
              >
                Logout
              </button>
            )}
          </div>

          <button className="md:hidden text-[#FA1239]" onClick={() => setOpen(!open)}>
            {/* Icons... unchanged */}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-sm">
          <Link to="/" className="block px-4 py-3 text-[#FA1239] border-b" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link to="/dashboard" className="block px-4 py-3 text-[#FA1239] border-b" onClick={() => setOpen(false)}>
            Dashboard
          </Link>

          {!loggedIn ? (
            <Link to="/login" className="block px-4 py-3 text-[#FA1239]" onClick={() => setOpen(false)}>
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-[#FA1239]">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

