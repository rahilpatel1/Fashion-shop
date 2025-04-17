import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New Password should match with confirm password not matched");
      return;
  }
    // onSubmit(email, newPassword);
    setError('');
    try {
        await onSubmit(email, newPassword);
        navigate('/login');
    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Email Address"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="New Password"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Confirm new password"
          required
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
        Reset Password
      </button>
    </form>
  );
}
