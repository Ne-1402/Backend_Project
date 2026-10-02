import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}