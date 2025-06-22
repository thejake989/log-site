import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "member",
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
      <h2 className="text-2xl font-bold">Register</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="w-full py-2 bg-blue-600 text-white rounded">
        Create Account
      </button>
    </form>
  );
};

export default Register;
