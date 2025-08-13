import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CreditForm from './CreditForm';
import Result from './Result';
import AdminPanel from './AdminPanel';
import { getCurrentUser } from './auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Auto-redirect admins to admin panel if they land on dashboard
        if (userData?.role === 'admin' && window.location.pathname === '/dashboard') {
          navigate('/admin');
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          {/* Root path - redirect based on auth and role */}
          <Route 
            path="/" 
            element={
              user 
                ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
                : <Navigate to="/login" />
            } 
          />

          {/* Auth routes with role-aware redirect */}
          <Route 
            path="/login" 
            element={
              !user 
                ? <Login setUser={setUser} /> 
                : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
            } 
          />
          
          <Route 
            path="/register" 
            element={
              !user 
                ? <Register setUser={setUser} /> 
                : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
            } 
          />

          {/* Regular user routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/evaluate" 
            element={user ? <CreditForm user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/result/:inputId" 
            element={user ? <Result user={user} /> : <Navigate to="/login" />} 
          />

          {/* Protected admin route */}
          <Route 
            path="/admin" 
            element={
              user?.role === 'admin' 
                ? <AdminPanel user={user} /> 
                : <Navigate to={user ? "/dashboard" : "/login"} />
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;