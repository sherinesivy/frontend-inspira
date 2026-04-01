import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      login(JSON.parse(decodeURIComponent(user)), token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAFAFA",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <p style={{ color: "#737373", fontSize: "1rem" }}>Signing you in...</p>
    </div>
  );
}

export default GoogleAuthSuccess;