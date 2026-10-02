import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const preview =
    article.content.length > 150
      ? article.content.slice(0, 150) + "..."
      : article.content;

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <h3 style={{ margin: 0 }}>
        <Link to={`/articles/${article._id}`}>{article.title}</Link>
      </h3>
      <small>
        {article.category} · by {article.author?.name || "Unknown"}
      </small>
      <p>{preview}</p>
    </div>
  );
}