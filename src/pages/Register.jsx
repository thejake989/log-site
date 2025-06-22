import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [availablePlayer, setAvailablePlayer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailablePlayer = async () => {
      const playerSnapshot = await getDocs(collection(db, "players"));
      const usersSnapshot = await getDocs(collection(db, "users"));

      const usedIds = usersSnapshot.docs.map((doc) => doc.data().playerId);
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const available = playerSnapshot.docs.find(
        (doc) =>
          !usedIds.includes(doc.id) &&
          doc.data().name.toLowerCase() === fullName.toLowerCase()
      );

      if (available) {
        setAvailablePlayer({ id: available.id, ...available.data() });
      } else {
        setAvailablePlayer(null);
      }
    };

    if (firstName && lastName) {
      fetchAvailablePlayer();
    }
  }, [firstName, lastName]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!availablePlayer) {
      alert("No matching player found. Contact the commissioner.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName,
        lastName,
        playerId: availablePlayer.id,
        admin: false,
        createdAt: new Date(),
      });

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="p-6 max-w-md mx-auto mt-12 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Register</h2>

      <input
        type="text"
        placeholder="First Name"
        className="w-full p-2 border rounded"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        className="w-full p-2 border rounded"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {availablePlayer ? (
        <div className="text-sm text-gray-600">
          Assigned to: <strong>{availablePlayer.name}</strong>
          {availablePlayer.nickname && ` ("${availablePlayer.nickname}")`}
        </div>
      ) : (
        <p className="text-sm text-red-500">
          No matching player found with that name.
        </p>
      )}

      <button
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!availablePlayer}
      >
        Create Account
      </button>
    </form>
  );
};

export default Register;
