import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const Admin = () => {
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [locationUrl, setLocationUrl] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [nickname, setNickname] = useState("");
  const [players, setPlayers] = useState([]);

  const fetchPlayers = async () => {
    const snapshot = await getDocs(collection(db, "players"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPlayers(data);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const isoDateTime = new Date(`${eventDate}T${eventTime}`).toISOString();

      await addDoc(collection(db, "events"), {
        name,
        dateTime: isoDateTime,
        locationUrl,
        createdAt: serverTimestamp(),
      });

      alert("Event added!");
      setName("");
      setEventDate("");
      setEventTime("");
      setLocationUrl("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    await addDoc(collection(db, "players"), {
      name: playerName,
      nickname,
      createdAt: serverTimestamp(),
    });

    setPlayerName("");
    setNickname("");
    fetchPlayers();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this member?")) {
      await deleteDoc(doc(db, "players", id));
      fetchPlayers();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      {/* Add Event Card */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add New Event</h2>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="url"
            placeholder="Google Maps URL (optional)"
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Add Event
          </button>
        </form>
      </div>

      {/* Add Member Card */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
        <form onSubmit={handleAddPlayer} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nickname (optional)"
            className="w-full p-2 border rounded"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Add Member
          </button>
        </form>
      </div>

      {/* Member List Card */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Current Members</h2>
        {players.length === 0 ? (
          <p className="text-gray-600">No members yet.</p>
        ) : (
          <ul className="space-y-2">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-medium">{player.name}</p>
                  {player.nickname && (
                    <p className="text-sm text-gray-500">"{player.nickname}"</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(player.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admin;
