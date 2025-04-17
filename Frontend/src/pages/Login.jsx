import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const userData = await login(email, password); // Make sure `login()` returns user info
      const isAdmin = userData?.role === 'admin'; // or however your backend defines it

      console.log("Role =" + userData.role);
  
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/Home');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue</p>
        <LoginForm onSubmit={handleLogin} />
        <p className="auth-link">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link-text">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
