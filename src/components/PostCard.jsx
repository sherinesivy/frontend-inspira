import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/PostCard.css";

function PostCard({ post, onLike }) {
  const { user, token } = useAuth();

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onLike(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isLiked = user && post.likes.includes(user.id);

  return (
    <Link to={`/post/${post._id}`} className="postcard">
      <div className="postcard-inner">
        <div className="postcard-img-wrap">
          <img src={post.imageUrl} alt={post.title} className="postcard-img" />
          <div className="postcard-overlay" />
          <button onClick={handleLike} className={`postcard-like ${isLiked ? "liked" : ""}`}>
            {isLiked ? "♥" : "♡"} {post.likes.length}
          </button>
        </div>
        <div className="postcard-info">
          <p className="postcard-title">{post.title}</p>
          {post.tags.length > 0 && (
            <div className="postcard-tags">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="postcard-tag">#{tag}</span>
              ))}
            </div>
          )}
          <p className="postcard-author">by {post.createdBy?.username}</p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;