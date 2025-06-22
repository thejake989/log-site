import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-4 max-w-md mx-auto mt-12 space-y-4 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full py-2 bg-green-600 text-white rounded">
        Log In
      </button>
    </form>
  );
};

export default Login;
