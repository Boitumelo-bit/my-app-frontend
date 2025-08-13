import { Link } from 'react-router-dom';
import { logout } from './auth';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/" className="logo-link">
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7L16,11.2V18H14V14H10V18H8V11.2L12,7.7M12,8.5L9,11H15L12,8.5Z" />
            </svg>
            <span>CreditEval</span>
          </Link>
        </div>
        
        <nav className="navbar-links">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link">
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                </svg>
                <span>{user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
              </Link>
              
              {/* Only show New Evaluation for non-admin users */}
              {user.role !== 'admin' && (
                <Link to="/evaluate" className="nav-link">
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  <span>New Evaluation</span>
                </Link>
              )}

              <div className="user-info">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="username">{user.username}</span>
                  <span className={`user-role ${user.role}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <svg className="logout-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="auth-link register-link">
                <span>Create Account</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;