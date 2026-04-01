import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
import "../styles/Explore.css";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tag = searchParams.get("tag") || "";
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts${tag ? `?tag=${tag}` : ""}`
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchParams]);

  const handleLike = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const activeTag = searchParams.get("tag");

  return (
    <div className="explore-page">
      {activeTag && (
        <div className="explore-tag-header">
          <p>Results for <span>#{activeTag}</span></p>
        </div>
      )}

      <div className="explore-feed">
        {loading ? (
          <p className="explore-status">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="explore-status">No posts found 🌸</p>
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

export default Explore;