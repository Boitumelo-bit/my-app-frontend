import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './auth';
import './Register.css';

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { user } = await register({ username, email, password, role });
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-wrapper">
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </div>
          <h2>Create Account</h2>
          <p>Join us today to get started</p>
        </div>
        
        {error && <div className="register-error">{error}</div>}
        
        <form onSubmit={onSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder=" "
              required
            />
            <label>Username</label>
            <div className="input-highlight"></div>
          </div>
          
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
              minLength="6"
            />
            <label>Password</label>
            <div className="input-highlight"></div>
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder=" "
              required
              minLength="6"
            />
            <label>Confirm Password</label>
            <div className="input-highlight"></div>
          </div>

          <div className="form-group role-selector">
           
            <div className="role-buttons">
              <button
                type="button"
                className={`role-button ${role === 'user' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'user'})}
              >
                <span className="role-icon">👤</span>
                <span className="role-title">Standard User</span>
                <span className="role-description">Access basic features</span>
              </button>
              <button
                type="button"
                className={`role-button ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'admin'})}
              >
                <span className="role-icon">🔒</span>
                <span className="role-title">Administrator</span>
                <span className="role-description">Full system access</span>
              </button>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="register-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <svg className="arrow-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
                <span>Register</span>
              </>
            )}
          </button>
        </form>
        
        <div className="register-footer">
          <span>Already have an account?</span>
          <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

export default Register;