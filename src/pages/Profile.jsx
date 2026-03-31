import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import "../styles/Profile.css";

function Profile() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`),
          axios.get(`http://localhost:5000/api/posts?user=${id}`),
        ]);
        setProfile(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="profile-status">Loading...</p>;
  if (!profile) return <p className="profile-status">User not found</p>;

  const isOwner = user && user.id === id;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.username?.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-username">{profile.username}</h1>
        <p className="profile-meta">{posts.length} {posts.length === 1 ? "pin" : "pins"}</p>

        {isOwner && (
          <button onClick={handleLogout} className="profile-logout-btn">
            Log out
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="profile-feed">
        {posts.length === 0 ? (
          <p className="profile-empty">No pins yet 🌸</p>
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

export default Profile;