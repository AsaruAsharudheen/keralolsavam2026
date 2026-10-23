import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(username, password);
      if (res.success) {
        onLoginSuccess(res.token, res.admin);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, padding: '60px 16px' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
            <Lock size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Official Admin Login</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Nellaya Gramapanchayat Tournament Administration
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: 8, padding: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          Default credential: <code>admin</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
}
