// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PlayerCard from "../components/PlayerCard";

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
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h2>
      {totals.map((player, i) => (
        <PlayerCard key={player.playerId} player={player} index={i} />
      ))}
    </div>
  );
};

export default Leaderboard;
