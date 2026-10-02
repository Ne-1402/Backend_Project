import { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import { CATEGORIES } from "../constants";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState({ search: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/articles", { params: query })
      .then((res) => {
        setArticles(res.data);
        setError("");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load articles")
      )
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery({ search, category });
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setQuery({ search, category: e.target.value });
  };

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h2>Published Articles</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={category} onChange={handleCategory}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && articles.length === 0 && <p>No articles found.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </div>
  );
}