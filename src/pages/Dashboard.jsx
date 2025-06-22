import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
      <button
        onClick={() => signOut(auth)}
        className="px-4 py-2 bg-red-600 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
