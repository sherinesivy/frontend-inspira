import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get("token");

    const verify = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch {
        setStatus("invalid");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "24px",
        padding: "48px 40px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        textAlign: "center",
        maxWidth: "420px",
        width: "100%",
      }}>
        {status === "verifying" && (
          <p style={{ fontSize: "1rem", color: "#737373" }}>Verifying your email...</p>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎀</div>
            <h2 style={{ color: "#D6006E", fontWeight: 800, marginBottom: "12px" }}>Email Verified!</h2>
            <p style={{ color: "#737373", marginBottom: "28px" }}>Your account is ready!</p>
            <Link to="/login" style={{
              background: "#D6006E",
              color: "white",
              padding: "12px 32px",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: 700,
            }}>Login to Inspira 🎀</Link>
          </>
        )}

        {status === "invalid" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>😕</div>
            <h2 style={{ color: "#1A1A1A", fontWeight: 800, marginBottom: "12px" }}>Link Invalid</h2>
            <p style={{ color: "#737373", marginBottom: "28px" }}>This verification link is invalid or has expired.</p>
            <Link to="/register" style={{
              background: "#D6006E",
              color: "white",
              padding: "12px 32px",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: 700,
            }}>Register again</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;