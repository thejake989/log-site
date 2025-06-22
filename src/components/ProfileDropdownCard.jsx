import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileDropdownCard = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Dummy data until stats are wired in from Firestore
  const nickname = "DutchOven";
  const stats = {
    shirt: 4,
    challenge: 146,
    attendance: 1,
    activity: 2,
    total: 153,
  };

  return (
    <div className="absolute top-14 right-0 w-72 bg-gray-900 text-white rounded-xl shadow-lg p-4 z-50 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {user?.displayName || "Jake Gibson"}
            </p>
            <p className="text-blue-400 text-sm">({nickname})</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white text-lg hover:text-red-400"
        >
          ✕
        </button>
      </div>

      <hr className="border-gray-700 mb-3" />

      <div className="mb-3">
        <h3 className="text-yellow-400 font-semibold mb-1">
          🏆 Lifetime Stats
        </h3>
        <ul className="text-sm space-y-1">
          <li>
            🟢 Log Shirt: <span className="font-bold">{stats.shirt}</span>
          </li>
          <li>
            🎯 Challenge: <span className="font-bold">{stats.challenge}</span>
          </li>
          <li>
            🎲 Attendance: <span className="font-bold">{stats.attendance}</span>
          </li>
          <li>
            🔥 Activity: <span className="font-bold">{stats.activity}</span>
          </li>
        </ul>
      </div>

      <div className="text-white font-semibold text-lg mb-3">
        Total Points: <span className="text-blue-400">{stats.total}</span>
      </div>

      <hr className="border-gray-700 mb-3" />

      <button
        onClick={handleLogout}
        className="w-full py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdownCard;
