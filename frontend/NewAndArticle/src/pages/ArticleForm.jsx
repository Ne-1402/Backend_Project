import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { CATEGORIES } from "../constants";

export default function ArticleForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: CATEGORIES[0],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get("/articles/my")
      .then((res) => {
        const found = res.data.find((a) => a._id === id);
        if (!found) setError("Article not found");
        else if (found.status !== "draft")
          setError("Published articles cannot be edited");
        else
          setForm({
            title: found.title,
            content: found.content,
            category: found.category,
          });
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load article")
      );
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (id) await api.patch(`/articles/${id}`, form);
      else await api.post("/articles", form);
      navigate("/my-articles");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save article");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", padding: "0 16px" }}>
      <h2>{id ? "Edit Draft" : "New Article"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input name="title" placeholder="Title" value={form.title}
          onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea name="content" placeholder="Write your article..." rows={12}
          value={form.content} onChange={handleChange} required />
        <button type="submit">{id ? "Update Draft" : "Save as Draft"}</button>
      </form>
    </div>
  );
}