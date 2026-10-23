import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import { Trophy, Users, Shield, Award, Edit, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ token, onNavigateSub }) {
  const { data: statsData, loading, refetch } = useAutoPolling(api.getDashboardStats, 10000);
  const [resyncing, setResyncing] = useState(false);
  const [resyncMsg, setResyncMsg] = useState('');

  const stats = statsData?.stats;
  const currentLive = statsData?.current_live || [];
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Tournament Control Center</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            Nellaya Gramapanchayat Keralolsavam 2026 Admin Portal
          </p>
        </div>
        <button onClick={refetch} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {resyncMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          {resyncMsg}
        </div>
      )}

      {/* Grid of Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Total Teams</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4 }}>{stats?.total_teams ?? 54}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Pool A: {stats?.pool_a_teams ?? 27} · Pool B: {stats?.pool_b_teams ?? 27}</div>
        </div>

        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Seeded Byes</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4, color: '#fbbf24' }}>{stats?.bye_teams ?? 10}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Direct Round 2 Entry</div>
        </div>

        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Live Matches</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4, color: '#ef4444' }}>{stats?.live_matches ?? 0}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Active now</div>
        </div>

        <div className="stat-item" style={{ textAlign: 'left', padding: 14 }}>
          <div className="stat-lbl">Completed Matches</div>
          <div className="stat-val" style={{ fontSize: 24, marginTop: 4, color: '#10b981' }}>{stats?.completed_matches ?? 0}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Of 53 total matches</div>
        </div>
      </div>

      {/* Admin Action Quick Jump */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={() => onNavigateSub('scores')} 
          className="btn btn-primary" 
          style={{ padding: '14px', justifyContent: 'flex-start' }}
        >
          <Award size={18} /> Enter Live Scores & Goals
        </button>

        <button 
          onClick={() => onNavigateSub('teams')} 
          className="btn btn-outline" 
          style={{ padding: '14px', justifyContent: 'flex-start' }}
        >
          <Users size={18} /> Manage 54 Teams
        </button>

        <button 
          onClick={() => onNavigateSub('import')} 
          className="btn btn-outline" 
          style={{ padding: '14px', justifyContent: 'flex-start' }}
        >
          <Edit size={18} /> Fixture PDF Import & Verification
        </button>

        <button 
          onClick={handleResyncBracket} 
          disabled={resyncing}
          className="btn btn-outline" 
          style={{ padding: '14px', justifyContent: 'flex-start', color: '#38bdf8', borderColor: '#0284c7' }}
        >
          <RefreshCw size={18} className={resyncing ? 'spin' : ''} /> 
          {resyncing ? 'Re-syncing...' : 'Re-sync Knockout Bracket'}
        </button>
      </div>

      {/* Live and Latest Results preview */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Live & Recently Completed Matches
        </h3>
        {latestResults.length === 0 && currentLive.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            No matches underway or recently finalized. Use "Enter Live Scores" above to score matches.
          </div>
        ) : (
          <div>
            {[...currentLive, ...latestResults].map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <span className="badge" style={{ background: '#1e293b', color: '#38bdf8', marginRight: 8 }}>M{m.match_number}</span>
                  <strong style={{ color: '#fff' }}>{m.home_name}</strong> vs <strong style={{ color: '#fff' }}>{m.away_name}</strong>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>({m.round_name})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 900, color: '#10b981', fontSize: 16 }}>
                    {m.home_score} - {m.away_score}
                  </span>
                  <span className={`badge badge-${m.status.toLowerCase().replace('-', '')}`}>
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
