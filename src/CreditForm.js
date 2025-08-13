import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCreditData } from './api';
import './CreditForm.css';

function CreditForm({ user }) {
  const [formData, setFormData] = useState({
    income: '',
    debts: '',
    employment_years: '',
    credit_history_score: '',
    requested_amount: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    income,
    debts,
    employment_years,
    credit_history_score,
    requested_amount
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const numericData = {
        income: parseFloat(income),
        debts: parseFloat(debts),
        employment_years: parseInt(employment_years),
        credit_history_score: parseInt(credit_history_score),
        requested_amount: parseFloat(requested_amount)
      };
      
      const { result } = await submitCreditData(numericData);
      navigate(`/result/${result.credit_input_id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credit-form-container">
      <div className="credit-form-card">
        <div className="form-header">
          <h2>Credit Evaluation</h2>
          <p>Fill in your financial details to get a credit assessment</p>
        </div>
        
        {error && (
          <div className="form-error">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="credit-form">
          <div className="form-group">
            <input
              type="number"
              name="income"
              value={income}
              onChange={onChange}
              placeholder=" "
              min="0"
              step="0.01"
              required
            />
            <label>Annual Income (M)</label>
            <div className="input-highlight"></div>
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="debts"
              value={debts}
              onChange={onChange}
              placeholder=" "
              min="0"
              step="0.01"
              required
            />
            <label>Total Debts (M)</label>
            <div className="input-highlight"></div>
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="employment_years"
              value={employment_years}
              onChange={onChange}
              placeholder=" "
              min="0"
              max="50"
              required
            />
            <label>Years of Employment</label>
            <div className="input-highlight"></div>
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="credit_history_score"
              value={credit_history_score}
              onChange={onChange}
              placeholder=" "
              min="0"
              max="100"
              required
            />
            <label>Credit History Score (0-100)</label>
            <div className="input-highlight"></div>
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="requested_amount"
              value={requested_amount}
              onChange={onChange}
              placeholder=" "
              min="0"
              step="0.01"
              required
            />
            <label>Requested Credit Amount (M)</label>
            <div className="input-highlight"></div>
          </div>
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                Evaluating...
              </>
            ) : 'Evaluate Credit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreditForm;