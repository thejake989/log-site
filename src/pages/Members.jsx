import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const playersSnap = await getDocs(collection(db, "players"));

      const playersMap = {};
      playersSnap.forEach((doc) => {
        playersMap[doc.id] = doc.data();
      });

      const merged = usersSnap.docs.map((doc) => {
        const user = doc.data();
        const player = playersMap[user.playerId] || {};
        return {
          id: doc.id,
          fullName: player.name || user.email,
          nickname: player.nickname || "",
          initials: player.name
            ? player.name
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : user.email.charAt(0).toUpperCase(),
        };
      });

      setMembers(merged);
    };

    fetchMembers();
  }, []);

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
              {member.initials}
            </div>
            <div>
              <p className="text-lg font-semibold">{member.fullName}</p>
              {member.nickname && (
                <p className="text-sm text-gray-300">"{member.nickname}"</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Members;
