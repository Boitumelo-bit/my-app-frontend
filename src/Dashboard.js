import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCreditHistory } from './api';
import './Dashboard.css'; // New CSS file for dashboard styles

function Dashboard({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getCreditHistory();
        setHistory(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h2>Welcome back, <span className="username">{user.username}</span></h2>
          <p className="welcome-message">Here's your credit evaluation overview</p>
        </div>
        {user.role === 'admin' && (
          <Link to="/admin" className="admin-panel-btn">
            <svg className="admin-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
            </svg>
            Admin Panel
          </Link>
        )}
      </div>

      <div className="dashboard-actions">
        <Link to="/evaluate" className="primary-action-btn">
          <svg className="action-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          New Credit Evaluation
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="history-section">
          <div className="section-header">
            <h3>Evaluation History</h3>
            <div className="history-count">{history.length} evaluations</div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your evaluations...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg className="error-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
              </svg>
              <p>{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
              </svg>
              <p>No evaluations yet</p>
              <Link to="/evaluate" className="empty-action-btn">
                Start your first evaluation
              </Link>
            </div>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Income</th>
                    <th>Debts</th>
                    <th>Score</th>
                    <th>Risk</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Date">
                        <div className="table-cell-content">
                          {new Date(item.evaluated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td data-label="Income">
                        <div className="table-cell-content">
                          M{item.income.toLocaleString()}
                        </div>
                      </td>
                      <td data-label="Debts">
                        <div className="table-cell-content">
                          M{item.debts.toLocaleString()}
                        </div>
                      </td>
                      <td data-label="Score">
                        <div className="table-cell-content">
                          <span className="score-badge">{item.credit_score}</span>
                        </div>
                      </td>
                      <td data-label="Risk" className={`risk-${item.risk_level.toLowerCase()}`}>
                        <div className="table-cell-content">
                          {item.risk_level}
                        </div>
                      </td>
                      <td data-label="Details">
                        <div className="table-cell-content">
                          <Link to={`/result/${item.id}`} className="view-details-btn">
                            <svg className="details-icon" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                            </svg>
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;