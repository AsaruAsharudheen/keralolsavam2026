import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import { Trophy, Search } from 'lucide-react';

export default function ScorersPage() {
  const [search, setSearch] = useState('');
  const [filterPool, setFilterPool] = useState('ALL');
  const { data } = useAutoPolling(api.getTopScorers, 10000);

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
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Top Goal Scorers Leaderboard</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Official tournament golden boot standings updated automatically from recorded match goals
        </p>
      </div>

      {/* Podium Cards */}
      {scorers.length >= 3 && !search && filterPool === 'ALL' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 10, margin: '20px 0 24px', alignItems: 'flex-end' }}>
          {/* 2nd place */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14, padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#94a3b8', color: '#ffffff', fontWeight: 900, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scorers[1].player_name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{scorers[1].team_name}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#059669', marginTop: 4 }}>
              {scorers[1].total_goals} <span style={{ fontSize: 11, color: '#64748b' }}>G</span>
            </div>
          </div>

          {/* 1st place */}
          <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', border: '2px solid #f59e0b', borderRadius: 16, padding: '18px 10px', textAlign: 'center', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#f59e0b', color: '#ffffff', fontWeight: 900, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
              <Trophy size={20} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scorers[0].player_name}
            </div>
            <div style={{ fontSize: 12, color: '#b45309', fontWeight: 700 }}>{scorers[0].team_name}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', marginTop: 6 }}>
              {scorers[0].total_goals} <span style={{ fontSize: 12, color: '#64748b' }}>goals</span>
            </div>
          </div>

          {/* 3rd place */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 14, padding: '14px 10px', textAlign: 'center', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#b45309', color: '#ffffff', fontWeight: 900, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              3
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {scorers[2].player_name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{scorers[2].team_name}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#059669', marginTop: 4 }}>
              {scorers[2].total_goals} <span style={{ fontSize: 11, color: '#64748b' }}>G</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search player or team..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40, fontSize: 14 }}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 13 }} />
        </div>

        <select 
          className="form-select" 
          value={filterPool} 
          onChange={(e) => setFilterPool(e.target.value)}
          style={{ width: 130, fontSize: 13 }}
        >
          <option value="ALL">All Pools</option>
          <option value="A">Pool A</option>
          <option value="B">Pool B</option>
        </select>
      </div>

      {/* Scorers Table */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
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
                padding: '14px 18px',
                borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                background: idx === 0 ? '#fffbeb' : '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 30, 
                  height: 30, 
                  borderRadius: 8, 
                  background: s.rank === 1 ? '#f59e0b' : (s.rank === 2 ? '#94a3b8' : (s.rank === 3 ? '#b45309' : '#f1f5f9')),
                  color: s.rank <= 3 ? '#ffffff' : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 13
                }}>
                  {s.rank}
                </div>
                <div>
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 15 }}>
                    {s.player_name} {s.jersey_number ? `(#${s.jersey_number})` : ''}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                    {s.team_name} · <span style={{ color: s.pool_code === 'A' ? '#047857' : '#1d4ed8' }}>Pool {s.pool_code}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#059669' }}>{s.total_goals}</div>
                {s.penalty_goals > 0 && (
                  <div style={{ fontSize: 11, color: '#64748b' }}>({s.penalty_goals} pen)</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
