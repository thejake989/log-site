import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[.\-_]/)
        .map((s) => s[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : "U";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <span className="text-xl">🏆</span>
          <span className="text-2xl font-bold">LOG League</span>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Nav Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 mt-4 md:mt-0`}
        >
          <Link to="/" className="block py-1 hover:underline">
            Dashboard
          </Link>
          <Link to="/leaderboard" className="block py-1 hover:underline">
            Leaderboard
          </Link>
          <Link to="/stats" className="block py-1 hover:underline">
            Stats
          </Link>
          <Link to="/members" className="block py-1 hover:underline">
            Members
          </Link>
        </div>

        {/* Avatar Dropdown */}
        <div className="relative ml-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-blue-400 hover:scale-105 transition-all"
          >
            {initials}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50 transition-all duration-150 ease-out">
              <Link
                to={`/profile/${user.uid}`}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
