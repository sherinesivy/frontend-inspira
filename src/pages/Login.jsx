import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
    login(res.data.user, res.data.token);
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="auth-page">
      <p className="auth-logo">Inspira</p>
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to your account</p>

        {error && <p className="auth-error">{error}</p>}

        

        <form onSubmit={handleSubmit} className="auth-form">
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
          <div style={{ textAlign: "right", marginTop: "-4px" }}>
            <Link to="/forgot-password" style={{ fontSize: "0.82rem", color: "#D6006E", fontWeight: 600, textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <button type="submit" className="auth-btn">Log in</button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center", color: "#AAAAAA", fontSize: "0.85rem" }}>or</div>

        
        <a  href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
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
          Don't have an account?{" "}
          <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;