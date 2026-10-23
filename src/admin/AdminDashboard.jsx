import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import { Award, Users, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ token, onNavigateSub }) {
  const { data: statsData, loading, refetch } = useAutoPolling(api.getDashboardStats, 10000);
  const [resyncing, setResyncing] = useState(false);
  const [resyncMsg, setResyncMsg] = useState('');

  const stats = statsData?.stats;
  const currentRunning = statsData?.current_live || [];
  const latestResults = statsData?.latest_results || [];

  const handleResyncBracket = async () => {
    setResyncing(true);
    setResyncMsg('');
    try {
      const res = await api.resyncProgression(token);
      if (res.success) {
        setResyncMsg(`Success! Re-synchronized ${res.updated_slots} bracket positions.`);
        refetch();
      } else {
        setResyncMsg(`Resync failed: ${res.message}`);
      }
    } catch (e) {
      setResyncMsg(`Error: ${e.message}`);
    } finally {
      setResyncing(false);
    }
  };

  return (
    <div>
      <div className="admin-header-title-bar">
        <div>
          <h1 className="admin-page-heading">Tournament Administration</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
            Nellaya Gramapanchayat Keralolsavam 2026 Admin Portal
          </p>
        </div>
        <button onClick={refetch} className="btn btn-outline admin-refresh-btn">
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {resyncMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
          {resyncMsg}
        </div>
      )}

      {/* Grid of Key Stats */}
      <div className="admin-stats-overview" style={{ marginBottom: 24 }}>
        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Total Teams</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4 }}>{stats?.total_teams ?? 54}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Pool A: {stats?.pool_a_teams ?? 27} · Pool B: {stats?.pool_b_teams ?? 27}</div>
        </div>

        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Seeded Byes</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4, color: '#d97706' }}>{stats?.bye_teams ?? 10}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Direct Round 2 Entry</div>
        </div>

        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Running Matches</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4, color: '#dc2626' }}>{stats?.live_matches ?? 0}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Active live now</div>
        </div>

        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Completed Matches</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4, color: '#059669' }}>{stats?.completed_matches ?? 0}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Of 53 total matches</div>
        </div>
      </div>

      {/* Admin Action Quick Jump */}
      <div className="admin-actions-grid" style={{ marginBottom: 24 }}>
        <button 
          onClick={() => onNavigateSub('scores')} 
          className="btn btn-primary" 
          style={{ padding: '14px', justifyContent: 'flex-start' }}
        >
          <Award size={18} /> Enter Running Scores & Goals
        </button>

        <button 
          onClick={() => onNavigateSub('teams')} 
          className="btn btn-outline" 
          style={{ padding: '14px', justifyContent: 'flex-start' }}
        >
          <Users size={18} /> Manage 54 Teams & Byes
        </button>

        <button 
          onClick={handleResyncBracket} 
          disabled={resyncing}
          className="btn btn-outline" 
          style={{ padding: '14px', justifyContent: 'flex-start', color: '#2563eb' }}
        >
          <RefreshCw size={18} className={resyncing ? 'spin' : ''} /> 
          {resyncing ? 'Re-syncing...' : 'Re-sync Knockout Bracket'}
        </button>
      </div>

      {/* Running and Latest Results */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 16, padding: '18px 16px', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 14 }}>
          Running & Recently Completed Matches
        </h3>
        {latestResults.length === 0 && currentRunning.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
            No matches running or recently completed. Use "Enter Running Scores" above to score matches.
          </div>
        ) : (
          <div>
            {[...currentRunning, ...latestResults].map(m => (
              <div key={m.id} className="admin-recent-match-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                  <span className="badge" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', fontSize: 11, padding: '2px 6px' }}>
                    M{m.match_number}
                  </span>
                  <span style={{ color: '#0f172a', fontSize: 13, fontWeight: 800 }}>
                    {m.home_name || m.home_team_name} <span style={{ color: '#94a3b8', fontWeight: 600 }}>vs</span> {m.away_name || m.away_team_name}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>({m.round_name})</span>
                </div>

                <div className="admin-recent-match-score-status">
                  <span style={{ fontWeight: 900, color: '#059669', fontSize: 16, background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>
                    {m.home_score} - {m.away_score}
                  </span>
                  <span className={`badge badge-${(m.status || '').toLowerCase()}`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
