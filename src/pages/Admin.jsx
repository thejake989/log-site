import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Admin = () => {
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        name,
        month,
        year,
        createdAt: serverTimestamp(),
      });
      alert("Event added!");
      setName("");
      setMonth("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleAddEvent}
      className="p-4 max-w-md mx-auto mt-12 space-y-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold">Add New Event</h2>
      <input
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button className="w-full py-2 bg-purple-600 text-white rounded">
        Add Event
      </button>
    </form>
  );
};

export default Admin;
