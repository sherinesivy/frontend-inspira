import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { Camera } from "lucide-react";
import "../styles/Profile.css";

function Profile() {
  const { id } = useParams();
  const { user, updateProfilePic } = useAuth();
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [setCroppedBlob] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
        const userPosts = postsRes.data.filter(
          (p) => p.createdBy?._id === id || p.createdBy === id
        );
        setPosts(userPosts);
        if (userPosts.length > 0) setProfileUser(userPosts[0].createdBy);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropAndUpload = async () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    const offsetX = (img.naturalWidth - size) / 2;
    const offsetY = (img.naturalHeight - size) / 2;
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 300, 300);
    canvas.toBlob(async (blob) => {
      setCroppedBlob(blob);
      setUploading(true);
      setCropSrc(null);
      try {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        await updateProfilePic(file);
      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
      }
    }, "image/jpeg", 0.9);
  };

  const handleLike = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const isOwnProfile = user?.id === id;
  const displayName = profileUser?.username || user?.username;
  const displayPic = isOwnProfile ? user?.profilePic : profileUser?.profilePic;

  const avatarColors = ["#D6006E", "#7C3AED", "#0891B2", "#059669", "#D97706"];
  const colorIndex = displayName ? displayName.charCodeAt(0) % avatarColors.length : 0;
  const avatarColor = avatarColors[colorIndex];

  return (
    <div className="profile-page">

      {/* crop modal */}
      {cropSrc && (
        <div className="crop-overlay">
          <div className="crop-modal">
            <h3 className="crop-title">Crop your photo</h3>
            <p className="crop-subtitle">The image will be cropped to a square from the center</p>
            <div className="crop-preview-wrapper">
              <img ref={imgRef} src={cropSrc} alt="crop preview" className="crop-img" />
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="crop-actions">
              <button className="crop-cancel" onClick={() => setCropSrc(null)}>Cancel</button>
              <button className="crop-confirm" onClick={handleCropAndUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* profile header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          {displayPic ? (
            <img src={displayPic} alt="profile" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-initial" style={{ background: avatarColor }}>
              {displayName?.[0]?.toUpperCase()}
            </div>
          )}

          {isOwnProfile && (
            <label className="profile-camera-btn">
              <Camera size={16} color="white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="profile-file-input"
              />
            </label>
          )}
        </div>

        <h1 className="profile-name">{displayName}</h1>
        <p className="profile-pins">{posts.length} {posts.length === 1 ? "pin" : "pins"}</p>
        {uploading && <p className="profile-uploading">Uploading...</p>}
      </div>

      {/* posts grid */}
      <div className="profile-grid-wrapper">
        {loading ? (
          <p className="profile-loading">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="profile-empty">
            {isOwnProfile ? "You haven't created any pins yet 🌸" : "No pins yet!"}
          </p>
        ) : (
          <div className="pins-grid">
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