import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, getUserStats, updateUserRole } from './api';
import './AdminPanel.css';
function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          getAllUsers(),
          getUserStats()
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  if (loading) return <div className="loading">Loading admin data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
     
      
      <div className="stats-section">
        <h3>System Statistics</h3>
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalEvaluations}</div>
              <div className="stat-label">Evaluations</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.averageScore}</div>
              <div className="stat-label">Avg. Score</div>
            </div>
          </div>
        )}
        
        {stats?.riskDistribution && (
          <div className="risk-distribution">
            <h4>Risk Level Distribution</h4>
            <div className="distribution-bars">
              {stats.riskDistribution.map(item => (
                <div key={item.risk_level} className="distribution-item">
                  <div className="risk-label">{item.risk_level}</div>
                  <div className="bar-container">
                    <div 
                      className={`bar risk-${item.risk_level.toLowerCase()}`}
                      style={{ width: `${(item.count / stats.totalEvaluations) * 100}%` }}
                    ></div>
                  </div>
                  <div className="risk-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="users-section">
        <h3>User Management</h3>
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(userItem => (
              <tr key={userItem.id}>
                <td>{userItem.id}</td>
                <td>{userItem.username}</td>
                <td>{userItem.email}</td>
                <td>
                  <select
                    value={userItem.role}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                    disabled={userItem.id === user.id} // Can't change own role
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                <td>
                  {userItem.id !== user.id && (
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRoleChange(userItem.id, userItem.role === 'admin' ? 'user' : 'admin')}
                    >
                      Toggle Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;