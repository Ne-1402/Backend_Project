import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "author",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="name" placeholder="Name" value={form.name}
          onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email}
          onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 6)"
          value={form.password} onChange={handleChange} required minLength={6} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="author">Author</option>
          <option value="editor">Editor</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}