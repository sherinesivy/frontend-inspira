import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
    setToast(true);
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#1A1A1A",
          color: "white",
          padding: "14px 24px",
          borderRadius: "999px",
          fontSize: "0.9rem",
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 9999,
          whiteSpace: "nowrap",
        }}>
          Verification email sent to {form.email}
        </div>
      )}
      <p className="auth-logo">Inspira</p>
      <div className="auth-card">
        <h1 className="auth-title">Join Inspira</h1>
        <p className="auth-subtitle">Find your inspiration</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
  {loading ? "Creating account..." : "Create account"}
</button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center", color: "#AAAAAA", fontSize: "0.85rem" }}>or</div>

        <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "white",
            border: "1.5px solid #EBEBEB",
            borderRadius: "12px",
            padding: "13px",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1A1A1A",
            textDecoration: "none",
            transition: "border-color 0.2s",
            marginBottom: "8px",
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
          Continue with Google
        </a>
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;