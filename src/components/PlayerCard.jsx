// src/pages/Leaderboard.jsx
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
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <h2 className="text-4xl font-bold mb-8 text-center">🏆 Leaderboard</h2>

      <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="text-left py-3 px-4">Player</th>
              <th className="py-3 px-4 text-center">Attendance</th>
              <th className="py-3 px-4 text-center">Shirt</th>
              <th className="py-3 px-4 text-center">Challenge</th>
              <th className="py-3 px-4 text-center">Activity</th>
              <th className="py-3 px-4 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((player, i) => (
              <tr
                key={player.playerId}
                className="even:bg-gray-900 hover:bg-gray-700 transition-all"
              >
                <td className="py-3 px-4 font-semibold text-blue-300">
                  <Link
                    to={`/profile/${player.playerId}`}
                    className="hover:underline"
                  >
                    {i + 1}. {player.playerName}
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">{player.attendance}</td>
                <td className="py-3 px-4 text-center">{player.logShirt}</td>
                <td className="py-3 px-4 text-center">{player.challenge}</td>
                <td className="py-3 px-4 text-center">{player.activity}</td>
                <td className="py-3 px-4 text-center font-bold text-green-400">
                  {player.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
