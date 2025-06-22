import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const snapshot = await getDocs(collection(db, "scores"));
      const raw = snapshot.docs.map((doc) => doc.data());

      const grouped = {};
      raw.forEach((entry) => {
        const id = entry.playerId;
        if (!grouped[id]) {
          grouped[id] = {
            playerId: id,
            playerName: entry.playerName || "",
            attendance: 0,
            logShirt: 0,
            challenge: 0,
            activity: 0,
            total: 0,
          };
        }
        grouped[id].attendance += entry.attendance || 0;
        grouped[id].logShirt += entry.logShirt || 0;
        grouped[id].challenge += entry.challenge || 0;
        grouped[id].activity += entry.activity || 0;
        grouped[id].total +=
          (entry.attendance || 0) +
          (entry.logShirt || 0) +
          (entry.challenge || 0) +
          (entry.activity || 0);
      });

      const totalsArray = Object.values(grouped).sort(
        (a, b) => b.total - a.total
      );
      setTotals(totalsArray);
    };

    fetchScores();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">
        🏆 Leaderboard
      </h2>
      <div className="space-y-4">
        {totals.map((player, i) => (
          <div
            key={player.playerId}
            className="bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                  {player.playerName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <Link
                  to={`/profile/${player.playerId}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {i + 1}. {player.playerName}
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-400">🎟️ Attend</p>
                  <p className="font-bold">{player.attendance}</p>
                </div>
                <div>
                  <p className="text-gray-400">👕 Shirt</p>
                  <p className="font-bold">{player.logShirt}</p>
                </div>
                <div>
                  <p className="text-gray-400">⚔️ Challenge</p>
                  <p className="font-bold">{player.challenge}</p>
                </div>
                <div>
                  <p className="text-gray-400">🎯 Activity</p>
                  <p className="font-bold">{player.activity}</p>
                </div>
                <div>
                  <p className="text-gray-400">🔥 Total</p>
                  <p className="font-extrabold text-yellow-400">
                    {player.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
