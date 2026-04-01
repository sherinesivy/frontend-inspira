import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/CreatePost.css";

function CreatePost() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return setError("Please select an image!");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("tags", form.tags);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1 className="create-title">Create a Pin</h1>

        <div className="create-card">
          {/* left — image upload */}
          <div className="create-image-side">
            <label className="create-upload-label">
              {preview ? (
                <div className="create-preview-wrap">
                  <img src={preview} alt="preview" className="create-preview-img" />
                  <div className="create-preview-overlay">
                    <span>Change image</span>
                  </div>
                </div>
              ) : (
                <div className="create-upload-placeholder">
                  <div className="create-upload-icon">📌</div>
                  <p className="create-upload-text">Click to upload</p>
                  <p className="create-upload-sub">Any size, any format</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="create-file-input"
              />
            </label>
          </div>

          {/* right — form */}
          <div className="create-form-side">
            {error && <p className="create-error">{error}</p>}

            <div className="create-field">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Give your pin a title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-field">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Tell everyone what your pin is about"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="create-field">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="fashion, aesthetic, vintage"
                value={form.tags}
                onChange={handleChange}
              />
              <span className="create-field-hint">Separate tags with commas</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="create-submit-btn"
            >
              {loading ? "Uploading..." : "Publish Pin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;