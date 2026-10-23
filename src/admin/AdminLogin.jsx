import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock } from 'lucide-react';

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
      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 18, padding: '32px 26px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)' }}>
            <Lock size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>Admin Sign In</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Nellaya Gramapanchayat Tournament Administration
          </p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
            {error}
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

        <div style={{ marginTop: 22, textAlign: 'center', fontSize: 12, color: '#64748b' }}>
          Default access: <code>admin</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
}
