import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <p className="auth-logo">Inspira</p>
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📩</div>
          <h1 className="auth-title">Check your inbox!</h1>
          <p className="auth-subtitle" style={{ marginBottom: "28px" }}>
            We sent a password reset link to <strong>{email}</strong>. It expires in 1 hour.
          </p>
          <Link to="/login" className="auth-btn" style={{ display: "inline-block", textDecoration: "none", borderRadius: "999px" }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <p className="auth-logo">Inspira</p>
      <div className="auth-card">
        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Send reset link</button>
        </form>

        <p className="auth-switch">
          Remember your password?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;