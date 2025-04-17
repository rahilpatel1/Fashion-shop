import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResetPasswordForm from "../components/auth/ResetPasswordForm"; // Import new form

export default function ResetPassword() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (email, newPassword) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/reset-password", { email, newPassword });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (error) {
      setMessage("Error resetting password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your email and new password</p>
        <ResetPasswordForm onSubmit={handleResetPassword} />
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
