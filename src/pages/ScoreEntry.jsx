import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

const ScoreEntry = () => {
  const [players, setPlayers] = useState([]);
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const eventsSnapshot = await getDocs(collection(db, "events"));

      setPlayers(
        usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setEvents(
        eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchData();
  }, []);

  const handleInputChange = (playerId, field, value) => {
    setScores((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: Number(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) return alert("Select an event.");

    const selectedEvent = events.find((e) => e.id === eventId);

    for (const player of players) {
      const playerScores = scores[player.id] || {};
      await addDoc(collection(db, "scores"), {
        playerId: player.id,
        playerName: player.email,
        eventId,
        year: selectedEvent.year,
        month: selectedEvent.month,
        attendance: playerScores.attendance || 0,
        logShirt: playerScores.logShirt || 0,
        challenge: playerScores.challenge || 0,
        activity: playerScores.activity || 0,
      });
    }

    alert("Scores submitted!");
    setScores({});
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Enter Scores</h2>

      <select
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Event</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name} – {event.month} {event.year}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit} className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="border-b pb-2">
            <h3 className="font-semibold mb-1">{player.email}</h3>
            <div className="grid grid-cols-4 gap-2">
              {["attendance", "logShirt", "challenge", "activity"].map(
                (field) => (
                  <input
                    key={field}
                    type="number"
                    placeholder={field}
                    className="p-1 border rounded"
                    onChange={(e) =>
                      handleInputChange(player.id, field, e.target.value)
                    }
                  />
                )
              )}
            </div>
          </div>
        ))}

        <button className="w-full py-2 bg-green-700 text-white rounded">
          Submit Scores
        </button>
      </form>
    </div>
  );
};

export default ScoreEntry;
