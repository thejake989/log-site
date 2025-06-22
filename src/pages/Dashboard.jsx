import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
          <p className="mt-1 text-gray-300">{user.email}</p>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/profile/${user.uid}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition"
          >
            View My Profile
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white transition"
          >
            Leaderboard
          </button>
          <button
            onClick={() => signOut(auth)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
