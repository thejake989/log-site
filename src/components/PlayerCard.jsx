// src/components/PlayerCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const PlayerCard = ({ player, index }) => {
  const [open, setOpen] = useState(false);
  const initials = player.playerName
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className="relative mb-4">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 cursor-pointer bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition"
      >
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
        <div className="text-white font-medium">
          {index + 1}. {player.playerName}
        </div>
      </div>

      {open && (
        <div className="bg-gray-900 text-white p-4 mt-2 rounded shadow-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>🎽 Shirt: {player.logShirt}</span>
            <span>✅ Attendance: {player.attendance}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>⚡ Challenge: {player.challenge}</span>
            <span>🎯 Activity: {player.activity}</span>
          </div>
          <div className="text-right mt-2 text-green-400 font-bold">
            Total: {player.total}
          </div>
          <Link
            to={`/profile/${player.playerId}`}
            className="block mt-2 text-blue-400 hover:underline text-sm text-right"
          >
            View Full Profile →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
