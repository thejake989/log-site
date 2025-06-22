import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRole(snap.data().role || "member");
      }
    };

    if (user?.uid) {
      fetchRole();
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.email}</h1>
      <p className="mb-6">
        Role: <span className="text-green-400 font-semibold">{role}</span>
      </p>

      <div className="space-x-4">
        <button
          onClick={() => navigate(`/profile/${user.uid}`)}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          View My Profile
        </button>
        <button
          onClick={() => signOut(auth)}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
