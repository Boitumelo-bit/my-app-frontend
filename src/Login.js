import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './auth';
import './Login.css';

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { user } = await login({ email, password, role });
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-wrapper">
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder=" "
              required
            />
            <label>Email Address</label>
            <div className="input-highlight"></div>
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder=" "
              required
            />
            <label>Password</label>
            <div className="input-highlight"></div>
          </div>

          <div className="form-group role-selector">
            <label>Login As</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-button ${role === 'user' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'user'})}
              >
                <span className="role-icon">👤</span>
                <span>Standard User</span>
              </button>
              <button
                type="button"
                className={`role-button ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'admin'})}
              >
                <span className="role-icon">🔒</span>
                <span>Administrator</span>
              </button>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <svg className="arrow-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <span>Don't have an account?</span>
          <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
}

export default Login;