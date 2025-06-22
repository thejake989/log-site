import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const now = new Date();

      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((event) => {
          const start = new Date(event.dateTime);
          const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
          return new Date() <= end;
        })
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

      setEvents(data);
    };

    fetchEvents();
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 space-y-10">
      {/* Main Welcome Card */}
      <div className="bg-gray-800 rounded-xl shadow-xl p-8 max-w-md mx-auto text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
          <p className="mt-1 text-gray-300">{user.email}</p>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/profile/${user.uid}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition"
          >
            View My Profile
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white transition"
          >
            Leaderboard
          </button>
          <button
            onClick={() => signOut(auth)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">
          📆 Upcoming Events
        </h2>
        {events.length === 0 ? (
          <p className="text-center text-gray-400">No upcoming events.</p>
        ) : (
          events.map((event) => {
            const now = new Date();
            const start = new Date(event.dateTime);
            const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
            const isLive = now >= start && now <= end;
            const isFuture = now < start;

            if (isLive) {
              return (
                <div
                  key={event.id}
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-6 rounded-lg shadow-xl text-center animate-pulse border border-white/30"
                >
                  <h3 className="text-3xl font-bold mb-1">🔥 EVENT IS LIVE!</h3>
                  <p className="text-lg font-semibold">{event.name}</p>
                  <p className="text-sm mt-1">
                    {formatDateTime(event.dateTime)}
                  </p>
                  {event.locationUrl && (
                    <a
                      href={event.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 bg-black/30 hover:bg-black/50 transition rounded"
                    >
                      📍 View Location
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="mt-4 text-xs bg-black/40 hover:bg-black/60 px-2 py-1 rounded"
                  >
                    Delete Event
                  </button>
                </div>
              );
            }

            if (isFuture) {
              return (
                <div
                  key={event.id}
                  className="bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 relative cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => {
                    if (event.locationUrl) {
                      window.open(event.locationUrl, "_blank");
                    }
                  }}
                >
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                  <p className="text-gray-300 mt-1">
                    {formatDateTime(event.dateTime)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    title="Delete Event"
                    className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 shadow-sm transition"
                  >
                    ✕
                  </button>
                </div>
              );
            }

            return null; // expired
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
