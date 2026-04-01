import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/SinglePost.css";



function SinglePost() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tags: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
        setPost(res.data);
        setForm({
          title: res.data.title,
          description: res.data.description,
          tags: res.data.tags.join(", "),
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this pin?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(res.data);
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="single-status">Loading...</p>;
  if (!post) return <p className="single-status">Post not found</p>;

  const isLiked = user && post.likes.includes(user.id);
  const isOwner = user && post.createdBy?._id === user.id;

  return (
    <div className="single-page">
      <div className="single-card">

        {/* image */}
        <div className="single-image-side">
          <img src={post.imageUrl} alt={post.title} className="single-img" />
        </div>

        {/* details */}
        <div className="single-detail-side">

          {/* actions row */}
          <div className="single-actions">
            <button
              onClick={handleLike}
              className={`single-like-btn ${isLiked ? "liked" : ""}`}
            >
              {isLiked ? "♥" : "♡"} {post.likes.length}
            </button>

            {isOwner && (
              <div className="single-owner-actions">
                <button
                  onClick={() => setEditing(!editing)}
                  className="single-edit-btn"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
                <button onClick={handleDelete} className="single-delete-btn">
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* edit form or post info */}
          {editing ? (
            <form onSubmit={handleEdit} className="single-edit-form">
              <div className="single-edit-field">
                <label>Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="single-edit-field">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="single-edit-field">
                <label>Tags</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <button type="submit" className="single-save-btn">Save changes</button>
            </form>
          ) : (
            <div className="single-info">
              <h1 className="single-post-title">{post.title}</h1>
              {post.description && (
                <p className="single-post-desc">{post.description}</p>
              )}
              {post.tags.length > 0 && (
                <div className="single-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="single-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* posted by */}
          <div className="single-author">
            <p className="single-author-label">Posted by</p>
            <Link to={`/profile/${post.createdBy?._id}`} className="single-author-name">
              {post.createdBy?.username}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SinglePost;