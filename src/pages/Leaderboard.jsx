import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const snapshot = await getDocs(collection(db, "scores"));
      const raw = snapshot.docs.map((doc) => doc.data());

      // Aggregate points by playerId
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
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h2>
      <div className="overflow-x-auto bg-gray-800 rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Player</th>
              <th className="p-2">Attendance</th>
              <th className="p-2">Shirt</th>
              <th className="p-2">Challenge</th>
              <th className="p-2">Activity</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((player, i) => (
              <tr
                key={player.playerId}
                className="odd:bg-gray-900 even:bg-gray-800"
              >
                <td className="p-2 font-semibold">
                  {i + 1}. {player.playerName}
                </td>
                <td className="p-2 text-center">{player.attendance}</td>
                <td className="p-2 text-center">{player.logShirt}</td>
                <td className="p-2 text-center">{player.challenge}</td>
                <td className="p-2 text-center">{player.activity}</td>
                <td className="p-2 text-center font-bold">{player.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
