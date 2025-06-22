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

    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
  });

  const header = (label, key) => (
    <th
      onClick={() => handleSort(key)}
      className="p-2 cursor-pointer hover:underline"
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
      <h2 className="text-3xl font-bold mb-6 text-center">
        📊 LOG League Stats
      </h2>
      <div className="overflow-x-auto bg-gray-800 rounded shadow">
        <table className="w-full table-auto text-sm md:text-base">
          <thead className="bg-gray-700">
            <tr>
              {header("Player", "playerName")}
              {header("Attendance", "attendance")}
              {header("Shirt", "logShirt")}
              {header("Challenge", "challenge")}
              {header("Activity", "activity")}
              {header("Total", "total")}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr
                key={player.playerId}
                className="odd:bg-gray-900 even:bg-gray-800 text-center"
              >
                <td className="p-2 font-semibold text-left">
                  {player.playerName}
                </td>
                <td className="p-2">{player.attendance}</td>
                <td className="p-2">{player.logShirt}</td>
                <td className="p-2">{player.challenge}</td>
                <td className="p-2">{player.activity}</td>
                <td className="p-2 font-bold">{player.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsPage;
