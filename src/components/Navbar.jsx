import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/explore?tag=${search.trim()}`);
      setSearch("");
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Inspira</Link>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search by tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="navbar-search-input"
        />
        <button type="submit" className="navbar-search-btn">Search</button>
      </form>

      <div className="navbar-links">
        <Link to="/explore" className="navbar-link">Explore</Link>

        {user ? (
          <>
            <Link to="/create" className="navbar-btn">+ Create</Link>
            <Link to={`/profile/${user.id}`} className="navbar-link">{user.username}</Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Log in</Link>
            <Link to="/register" className="navbar-btn">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;