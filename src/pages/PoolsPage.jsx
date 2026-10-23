import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { Shield, Award, Users, ChevronRight } from 'lucide-react';

export default function PoolsPage({ defaultPool = 'A', onSelectMatch }) {
  const [activePool, setActivePool] = useState(defaultPool);
  const { data: poolsData, loading } = useAutoPolling(api.getPoolsOverview, 12000);

  const pools = poolsData?.pools || [];
  const currentPoolData = pools.find(p => p.code === activePool) || pools[0];

  const teams = currentPoolData?.teams || [];
  const matches = currentPoolData?.matches || [];

  const byeTeams = teams.filter(t => t.is_bye == 1);
  const regularTeams = teams.filter(t => t.is_bye != 1);

  return (
    <div className="container">
      <div style={{ margin: '16px 0 12px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Tournament Pools System</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          Exact 2-Pool Division preserved directly from official fixture document
        </p>
      </div>

      {/* Pool Switcher */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activePool === 'A' ? 'active' : ''}`}
          onClick={() => setActivePool('A')}
        >
          Pool A (27 Teams · 5 Byes)
        </button>
        <button 
          className={`tab-btn ${activePool === 'B' ? 'active pool-b' : ''}`}
          onClick={() => setActivePool('B')}
        >
          Pool B (27 Teams · 5 Byes)
        </button>
      </div>

      {/* Pool Header Summary Card */}
      <div style={{ 
        background: activePool === 'A' 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 28, 63, 0.9) 100%)' 
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15, 28, 63, 0.9) 100%)',
        border: `1px solid ${activePool === 'A' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
        borderRadius: 14,
        padding: '16px',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{currentPoolData?.name || `Pool ${activePool}`}</h2>
          <span className={`badge badge-pool-${activePool.toLowerCase()}`}>
            Semi Match: M{activePool === 'A' ? '51' : '52'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
          {activePool === 'A' 
            ? 'Pool A bracket winner advances to Grand Final M53 as Team 1.' 
            : 'Pool B bracket winner advances to Grand Final M53 as Team 2.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div className="stat-val" style={{ fontSize: 16 }}>{teams.length}</div>
            <div className="stat-lbl">Total Teams</div>
          </div>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div className="stat-val" style={{ fontSize: 16, color: '#fbbf24' }}>{byeTeams.length}</div>
            <div className="stat-lbl">Byes (R2)</div>
          </div>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div className="stat-val" style={{ fontSize: 16, color: '#38bdf8' }}>{matches.length}</div>
            <div className="stat-lbl">Matches</div>
          </div>
        </div>
      </div>

      {/* 5 Bye Teams Spotlight */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Award size={16} /> Seeded Bye Teams (Direct Round 2 Entry)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {byeTeams.map(t => (
            <div key={t.id} style={{ background: 'var(--bg-surface)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-bye" style={{ marginRight: 6 }}>Seed #{t.seed_number}</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{t.name}</span>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Enters M{t.bye_target_match}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pool Bracket Diagram Link/View */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
          Official Pool {activePool} Bracket Tree Diagram
        </h3>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
          <img 
            src={`/pool${activePool}.png`} 
            alt={`Pool ${activePool} Bracket Tree`} 
            style={{ width: '100%', height: 'auto', borderRadius: 8, maxHeight: 400, objectFit: 'contain' }} 
          />
          <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
            Rendered directly from original official fixture PDF
          </div>
        </div>
      </div>

      {/* All 27 Teams in Pool */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Users size={16} /> All 27 Participating Teams in Pool {activePool}
        </h3>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
          {teams.map((t, idx) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: idx < teams.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 28, fontSize: 12, fontWeight: 800, color: '#64748b' }}>#{t.seed_number}</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{t.name}</span>
              </div>
              {t.is_bye == 1 && <span className="badge badge-bye">Bye (M{t.bye_target_match})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Pool Matches List */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Pool {activePool} Fixture Matches
        </h3>
        {matches.map(m => (
          <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
        ))}
      </div>
    </div>
  );
}
