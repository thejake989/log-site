import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const raw = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(raw);
    };

    fetchMembers();
  }, []);

  const getInitials = (nameOrEmail) => {
    const base = nameOrEmail?.split("@")[0] || "";
    const parts = base.split(/[.\-_ ]/).filter(Boolean);
    const initials = parts
      .map((s) => s[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
    return initials || "U";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">
        📋 Members
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <Link
            to={`/profile/${member.id}`}
            key={member.id}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 flex items-center space-x-4 transition-all"
          >
            <div className="bg-blue-600 w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold shadow-md">
              {getInitials(member.email || member.name)}
            </div>
            <div>
              <p className="text-lg font-semibold">
                {member.name || member.email}
              </p>
              {member.nickname && (
                <p className="text-sm text-gray-300">({member.nickname})</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Members;
