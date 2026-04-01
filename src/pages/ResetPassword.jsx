import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const token = searchParams.get("token");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <p className="auth-logo">Inspira</p>
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
          <h1 className="auth-title">Password Reset!</h1>
          <p className="auth-subtitle" style={{ marginBottom: "28px" }}>
            Your password has been updated. Redirecting you to login...
          </p>
          <Link to="/login" className="auth-btn" style={{ display: "inline-block", textDecoration: "none", borderRadius: "999px" }}>
            Login to Inspira 🎀
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <p className="auth-logo">Inspira</p>
      <div className="auth-card">
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">Enter your new password below</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;