import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCreditResult } from './api';
import './Result.css';

function Result({ user }) {
  const { inputId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getCreditResult(inputId);
        setResult(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [inputId]);

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading evaluation results...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <svg className="error-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
      </svg>
      <h3>Error Loading Results</h3>
      <p>{error}</p>
      <Link to="/dashboard" className="back-btn">
        Return to Dashboard
      </Link>
    </div>
  );

  if (!result) return (
    <div className="empty-state">
      <svg className="empty-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
      </svg>
      <h3>No Result Found</h3>
      <p>We couldn't find the evaluation you're looking for</p>
      <Link to="/dashboard" className="back-btn">
        Return to Dashboard
      </Link>
    </div>
  );

  const debtToIncomeRatio = (result.debts / result.income) * 100;

  return (
    <div className="result-page">
      <div className="result-header">
        <h1>Credit Evaluation Result</h1>
        <p className="evaluation-date">
          Evaluated on {new Date(result.evaluated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      
      <div className="result-overview">
        <div className={`score-card risk-${result.risk_level.toLowerCase()}`}>
          <div className="score-content">
            <h3>Credit Score</h3>
            <div className="score-value">{result.credit_score}</div>
            <div className="risk-level">
              <span className="risk-label">Risk Level:</span>
              <span className="risk-badge">{result.risk_level}</span>
            </div>
          </div>
          <div className="score-visual">
            <div className="gauge">
              <div 
                className="gauge-fill" 
                style={{ '--score': result.credit_score / 100 }}
              ></div>
              <div className="gauge-marker"></div>
              <div className="gauge-labels">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="recommendation-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
            </svg>
            <h3>Recommendation</h3>
          </div>
          <div className="card-body">
            <p>{result.recommendation}</p>
          </div>
        </div>
      </div>
      
      <div className="financial-details">
        <h2 className="section-title">
          <svg className="section-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
          </svg>
          Financial Details
        </h2>
        
        <div className="financial-grid">
          <div className="financial-card">
            <div className="financial-icon income-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </div>
            <div className="financial-content">
              <span className="financial-label">Annual Income</span>
              <span className="financial-value">M{result.income.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="financial-card">
            <div className="financial-icon debt-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </div>
            <div className="financial-content">
              <span className="financial-label">Total Debts</span>
              <span className="financial-value">M{result.debts.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="financial-card">
            <div className="financial-icon ratio-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M21,8C19.5,8 18.7,9.4 19.1,10.5L15.5,14.1C15.2,14 14.8,14 14.5,14.1L11.9,11.5C12.3,10.4 11.5,9 10,9C8.6,9 7.7,10.4 8.1,11.5L3.5,16C2.4,15.7 1,16.5 1,18C1,19.1 1.9,20 3,20C4.4,20 5.3,18.6 4.9,17.5L9.4,12.9C9.7,13 10.1,13 10.4,12.9L13,15.5C12.7,16.5 13.5,18 15,18C16.5,18 17.3,16.6 16.9,15.5L20.5,11.9C21.6,12.2 23,11.4 23,10C23,8.9 22.1,8 21,8M15,9L15.9,6.9L18,6L15.9,5.1L15,3L14.1,5.1L12,6L14.1,6.9L15,9M3.5,11L4,9L6,8.5L4,8L3.5,6L3,8L1,8.5L3,9L3.5,11Z" />
              </svg>
            </div>
            <div className="financial-content">
              <span className="financial-label">Debt-to-Income Ratio</span>
              <span className="financial-value">{debtToIncomeRatio.toFixed(2)}%</span>
              <div className="ratio-bar">
                <div 
                  className="ratio-fill" 
                  style={{ width: `${Math.min(debtToIncomeRatio, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="financial-card">
            <div className="financial-icon employment-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14M12,9L7,14H10V19H14V14H17L12,9Z" />
              </svg>
            </div>
            <div className="financial-content">
              <span className="financial-label">Years of Employment</span>
              <span className="financial-value">{result.employment_years}</span>
            </div>
          </div>
          
          <div className="financial-card">
            <div className="financial-icon history-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M11,8V14L15.75,16.85L16.5,15.62L12.5,13.25V8H11M7.88,3.58L6.6,1.58L8,0.5L9.38,2.41L7.88,3.58M16.12,3.58L14.62,2.41L16,0.5L17.4,1.58L16.12,3.58M4.27,5L2.5,3.23L3.23,2.5L5,4.27L4.27,5Z" />
              </svg>
            </div>
            <div className="financial-content">
              <span className="financial-label">Credit History Score</span>
              <span className="financial-value">{result.credit_history_score}/100</span>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ width: `${result.credit_history_score}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="financial-card">
            <div className="financial-icon amount-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z" />
              </svg>
            </div>
            <div className="financial-content">
              <span className="financial-label">Requested Amount</span>
              <span className="financial-value">M{result.requested_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="result-actions">
        <Link to="/dashboard" className="action-btn secondary">
          <svg className="action-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
          </svg>
          Back to Dashboard
        </Link>
        <button className="action-btn primary" onClick={() => window.print()}>
          <svg className="action-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />
          </svg>
          Print Report
        </button>
      </div>
    </div>
  );
}

export default Result;