import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/articles/${id}`)
      .then((res) => setArticle(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load article")
      );
  }, [id]);

  if (error) return <p style={{ padding: 16, color: "red" }}>{error}</p>;
  if (!article) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <Link to="/">← Back to articles</Link>
      <h1>{article.title}</h1>
      <p>
        <small>
          {article.category} · by {article.author?.name || "Unknown"}
          {article.publishedAt &&
            ` · ${new Date(article.publishedAt).toLocaleDateString()}`}
        </small>
      </p>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{article.content}</p>
    </div>
  );
}