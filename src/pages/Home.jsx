import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <div className="home-page">
      {!user && (
        <div className="home-hero">
          <h1 className="home-hero-title">Find your Inspira</h1>
          <p className="home-hero-sub">Discover ideas that move you</p>
          <Link to="/register" className="home-hero-btn">Get started</Link>
        </div>
      )}

      <div className="home-feed">
        {loading ? (
          <p className="home-status">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="home-empty">
            <p>No posts yet. Start inspiring! 🌸</p>
            <Link to="/create" className="home-create-btn">Create first pin</Link>
          </div>
        ) : (
          <div className="masonry-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;