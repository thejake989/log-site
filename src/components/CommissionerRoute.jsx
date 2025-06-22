import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const CommissionerRoute = ({ children }) => {
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().admin === true) {
        setIsAllowed(true);
      }

      setChecking(false);
    };

    checkAccess();
  }, [user]);

  if (checking) {
    return (
      <div className="text-white p-6 text-center">Checking admin access...</div>
    );
  }

  return isAllowed ? children : <Navigate to="/" />;
};

export default CommissionerRoute;
