import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Articles</Link>

      {user?.role === "author" && (
  <>
    <Link to="/new">New Article</Link>
    <Link to="/my-articles">My Articles</Link>
  </>
)}
      {user?.role === "editor" && <Link to="/editor">Editor Panel</Link>}

      <span style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            {user.name} ({user.role}){" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}