import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EditorPanel() {
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/articles/drafts")
      .then((res) => setDrafts(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load drafts")
      );
  }, []);

  const publish = async (id) => {
    try {
      await api.patch(`/articles/${id}/publish`);
      setDrafts(drafts.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h2>Editor Panel: Drafts Waiting for Review</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {drafts.length === 0 && !error && <p>No drafts to review.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {drafts.map((d) => (
          <div key={d._id} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{d.title}</h3>
            <small>
              {d.category} · by {d.author?.name || "Unknown"}
            </small>
            <p style={{ whiteSpace: "pre-wrap" }}>{d.content}</p>
            <button onClick={() => publish(d._id)}>Publish</button>
          </div>
        ))}
      </div>
    </div>
  );
}