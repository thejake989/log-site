// src/pages/StatsPage.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const StatsPage = () => {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "total",
    direction: "desc",
  });

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

      setPlayers(Object.values(grouped));
    };

    fetchScores();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
  });

  const renderHeader = (label, key) => (
    <th
      onClick={() => handleSort(key)}
      className="px-4 py-2 cursor-pointer text-left text-sm font-semibold text-white hover:text-blue-400"
    >
      {label}{" "}
      {sortConfig.key === key
        ? sortConfig.direction === "asc"
          ? "↑"
          : "↓"
        : ""}
    </th>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h2 className="text-4xl font-bold mb-8 text-center text-black">
        📊 League Stats
      </h2>
      <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
        <table className="w-full min-w-[600px] text-sm md:text-base">
          <thead className="bg-gray-700">
            <tr>
              {renderHeader("Player", "playerName")}
              {renderHeader("Attendance", "attendance")}
              {renderHeader("Shirt", "logShirt")}
              {renderHeader("Challenge", "challenge")}
              {renderHeader("Activity", "activity")}
              {renderHeader("Total", "total")}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, i) => (
              <tr
                key={player.playerId}
                className={`${
                  i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } hover:bg-gray-700 transition`}
              >
                <td className="px-4 py-3 font-medium text-white">
                  {player.playerName}
                </td>
                <td className="px-4 py-3 text-center">{player.attendance}</td>
                <td className="px-4 py-3 text-center">{player.logShirt}</td>
                <td className="px-4 py-3 text-center">{player.challenge}</td>
                <td className="px-4 py-3 text-center">{player.activity}</td>
                <td className="px-4 py-3 font-bold text-center">
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

export default StatsPage;
