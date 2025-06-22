import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Profile = () => {
  const { id } = useParams(); // get playerId from URL
  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState([]);
  const [totals, setTotals] = useState({
    attendance: 0,
    logShirt: 0,
    challenge: 0,
    activity: 0,
    total: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const scoreRef = query(
        collection(db, "scores"),
        where("playerId", "==", id)
      );
      const snapshot = await getDocs(scoreRef);
      const data = snapshot.docs.map((doc) => doc.data());

      const yearly = {};
      const total = {
        attendance: 0,
        logShirt: 0,
        challenge: 0,
        activity: 0,
        total: 0,
      };

      for (let entry of data) {
        if (!playerName) setPlayerName(entry.playerName || "");
        const year = entry.year;
        if (!yearly[year]) yearly[year] = [];
        yearly[year].push(entry);

        total.attendance += entry.attendance || 0;
        total.logShirt += entry.logShirt || 0;
        total.challenge += entry.challenge || 0;
        total.activity += entry.activity || 0;
        total.total +=
          (entry.attendance || 0) +
          (entry.logShirt || 0) +
          (entry.challenge || 0) +
          (entry.activity || 0);
      }

      setTotals(total);
      setHistory(yearly);
    };

    loadData();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">👤 {playerName}</h1>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Lifetime Totals</h2>
        <p>Attendance: {totals.attendance}</p>
        <p>Shirt: {totals.logShirt}</p>
        <p>Challenge: {totals.challenge}</p>
        <p>Activity: {totals.activity}</p>
        <p className="font-bold mt-2">Total: {totals.total}</p>
      </div>

      {Object.entries(history)
        .sort((a, b) => b[0] - a[0])
        .map(([year, entries]) => (
          <div key={year} className="mb-6">
            <h3 className="text-xl font-bold mb-2">{year}</h3>
            {entries.map((e, i) => (
              <div
                key={i}
                className="bg-gray-700 rounded p-2 mb-2 flex flex-col sm:flex-row sm:justify-between"
              >
                <div>
                  <strong>
                    {e.month} – {e.eventId?.slice(0, 6) || "Event"}
                  </strong>
                </div>
                <div className="flex gap-4 text-sm">
                  <span>🎽 {e.logShirt}</span>
                  <span>✅ {e.attendance}</span>
                  <span>⚡ {e.challenge}</span>
                  <span>🎯 {e.activity}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Profile;
