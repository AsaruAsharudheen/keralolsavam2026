import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import { Award, Trophy, Search, Shield, Filter } from 'lucide-react';

export default function ScorersPage() {
  const [search, setSearch] = useState('');
  const [filterPool, setFilterPool] = useState('ALL');
  const { data, loading, refetch } = useAutoPolling(api.getTopScorers, 10000);

  const scorers = data?.scorers || [];

  const filtered = scorers.filter(s => {
    if (filterPool !== 'ALL' && s.pool_code !== filterPool) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return s.player_name.toLowerCase().includes(q) || s.team_name.toLowerCase().includes(q);
  });

  return (
    <div className="container">
      <div style={{ margin: '16px 0 12px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Golden Boot Rankings</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          Official tournament top goal scorers updated automatically from confirmed match goal events
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {scorers.length >= 3 && !search && filterPool === 'ALL' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 8, margin: '20px 0 24px', alignItems: 'flex-end' }}>
          {/* 2nd place */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#94a3b8', color: '#000', fontWeight: 900, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scorers[1].player_name}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{scorers[1].team_name}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981', marginTop: 4 }}>
              {scorers[1].total_goals} <span style={{ fontSize: 10, color: '#94a3b8' }}>G</span>
            </div>
          </div>

          {/* 1st place */}
          <div style={{ background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 28, 63, 0.9) 100%)', border: '2px solid #f59e0b', borderRadius: 14, padding: '16px 8px', textAlign: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f59e0b', color: '#000', fontWeight: 900, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)' }}>
              <Trophy size={18} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scorers[0].player_name}
            </div>
            <div style={{ fontSize: 11, color: '#fbbf24' }}>{scorers[0].team_name}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 6 }}>
              {scorers[0].total_goals} <span style={{ fontSize: 11, color: '#94a3b8' }}>goals</span>
            </div>
          </div>

          {/* 3rd place */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#b45309', color: '#fff', fontWeight: 900, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              3
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scorers[2].player_name}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{scorers[2].team_name}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981', marginTop: 4 }}>
              {scorers[2].total_goals} <span style={{ fontSize: 10, color: '#94a3b8' }}>G</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search player or team..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, fontSize: 13 }}
          />
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
        </div>

        <select 
          className="form-select" 
          value={filterPool} 
          onChange={(e) => setFilterPool(e.target.value)}
          style={{ width: 120, fontSize: 13 }}
        >
          <option value="ALL">All Pools</option>
          <option value="A">Pool A</option>
          <option value="B">Pool B</option>
        </select>
      </div>

      {/* Scorers Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 14, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            No goals recorded yet. Scorer stats update automatically as match events are recorded.
          </div>
        ) : (
          filtered.map((s, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 16px',
                borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                background: idx === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: 8, 
                  background: s.rank === 1 ? '#f59e0b' : (s.rank === 2 ? '#94a3b8' : (s.rank === 3 ? '#b45309' : '#1e293b')),
                  color: s.rank <= 2 ? '#000' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 12
                }}>
                  {s.rank}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>
                    {s.player_name} {s.jersey_number ? `(#${s.jersey_number})` : ''}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    {s.team_name} · <span style={{ color: s.pool_code === 'A' ? '#34d399' : '#60a5fa' }}>Pool {s.pool_code}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{s.total_goals}</div>
                {s.penalty_goals > 0 && (
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>({s.penalty_goals} pen)</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
