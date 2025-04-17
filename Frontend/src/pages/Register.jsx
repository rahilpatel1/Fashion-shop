import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (name, email, password) => {
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Join us today</h1>
        <p className="auth-subtitle">Create an account to get started</p>
        {error && <p className="auth-error">{error}</p>}
        <RegisterForm onSubmit={handleRegister} />
        <p className="auth-link">
          Already have an account?{' '}
          <Link to="/login" className="auth-link-text">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
