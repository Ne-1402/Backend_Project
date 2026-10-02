import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/articles/my")
      .then((res) => setArticles(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load articles")
      );
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h2>My Articles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {articles.length === 0 && !error && <p>You haven't written anything yet.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {articles.map((a) => (
          <div key={a._id} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{a.title}</h3>
            <small>
              {a.category} · <strong>{a.status}</strong>
            </small>
            <div style={{ marginTop: 8 }}>
              {a.status === "draft" ? (
                <Link to={`/edit/${a._id}`}>Edit</Link>
              ) : (
                <Link to={`/articles/${a._id}`}>View</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}