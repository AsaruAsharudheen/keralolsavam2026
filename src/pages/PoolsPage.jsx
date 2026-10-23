import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { Shield, Award, Users, ChevronRight, GitBranch } from 'lucide-react';

export default function PoolsPage({ defaultPool = 'A', onSelectMatch }) {
  const [activePool, setActivePool] = useState(defaultPool);
  const { data: poolsData, loading } = useAutoPolling(api.getPoolsOverview, 10000);

  const pools = poolsData?.pools || [];
  const currentPoolData = pools.find(p => p.code === activePool) || pools[0];

  const teams = currentPoolData?.teams || [];
  const matches = currentPoolData?.matches || [];

  const byeTeams = teams.filter(t => t.is_bye == 1);
  const round1Matches = matches.filter(m => m.round_name === 'Round 1 · Preliminary');
  const round2Matches = matches.filter(m => m.round_name === 'Round 2');
  const round16Matches = matches.filter(m => m.round_name === 'Round of 16');
  const qfMatches = matches.filter(m => m.round_name === 'Quarter-Finals');
  const sfMatch = matches.find(m => m.round_name === 'Semi-Finals');

  return (
    <div className="container">
      <div style={{ margin: '16px 0 12px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Tournament Pools System</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Exact 2-Pool Division with Live Interactive Knockout Tree Model & Seeded Bye Teams
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

      {/* Pool Summary Card */}
      <div style={{ 
        background: activePool === 'A' 
          ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)' 
          : 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
        border: `2px solid ${activePool === 'A' ? '#a7f3d0' : '#bfdbfe'}`,
        borderRadius: 16,
        padding: '18px',
        marginBottom: 20,
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{currentPoolData?.name || `Pool ${activePool}`}</h2>
          <span className={`badge badge-pool-${activePool.toLowerCase()}`}>
            Semi-Finalist: M{activePool === 'A' ? '51' : '52'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>
          {activePool === 'A' 
            ? 'Pool A bracket champion emerges from Semi-Final M51 and advances to the Grand Final M53.' 
            : 'Pool B bracket champion emerges from Semi-Final M52 and advances to the Grand Final M53.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div className="stat-item">
            <div className="stat-val">{teams.length}</div>
            <div className="stat-lbl">Total Teams</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#d97706' }}>{byeTeams.length}</div>
            <div className="stat-lbl">Seeded Byes</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#2563eb' }}>{matches.length}</div>
            <div className="stat-lbl">Total Fixtures</div>
          </div>
        </div>
      </div>

      {/* 5 Bye Teams Spotlight */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#b45309', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Award size={18} /> Seeded Bye Teams (Direct Round 2 Entry)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {byeTeams.map(t => (
            <div key={t.id} className="bye-team-card">
              <div>
                <span className="badge badge-bye" style={{ marginRight: 6, fontSize: 10 }}>Seed #{t.seed_number}</span>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>{t.name}</span>
              </div>
              <span style={{ fontSize: 11, color: '#b45309', fontWeight: 900, background: '#fef3c7', padding: '3px 8px', borderRadius: 6 }}>
                Enters M{t.bye_target_match}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive HTML Model Tree: Clean Dynamic Layout Model */}
      <div className="pool-interactive-tree">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <GitBranch size={18} color="#059669" /> Pool {activePool} Knockout Fixture Tree Model
          </h3>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Scroll horizontally on mobile ➔</span>
        </div>

        <div className="pool-rounds-scroll">
          {/* Column 1: Round 1 */}
          <div className="pool-round-column">
            <div className={`round-col-header ${activePool === 'B' ? 'pool-b-header' : ''}`}>
              <span>Round 1 · Prelim</span>
              <span>{round1Matches.length} Ties</span>
            </div>
            {round1Matches.map(m => (
              <div 
                key={m.id} 
                className="tree-fixture-node" 
                onClick={() => onSelectMatch && onSelectMatch(m)} 
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontWeight: 800, marginBottom: 4 }}>
                  <span>M{m.match_number}</span>
                  <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.home_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.home_team_seed ? `#${m.home_team_seed} ` : ''}
                    {m.home_team_name || m.home_name || (m.home_source_type === 'BYE' ? `Bye Team (Seed #${m.home_source_val})` : `Winner M${m.home_source_val}`)}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.home_score : '-'}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.away_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.away_team_seed ? `#${m.away_team_seed} ` : ''}
                    {m.away_team_name || m.away_name || (m.away_source_type === 'BYE' ? `Bye Team (Seed #${m.away_source_val})` : `Winner M${m.away_source_val}`)}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.away_score : '-'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Round 2 (Includes Byes) */}
          <div className="pool-round-column">
            <div className={`round-col-header ${activePool === 'B' ? 'pool-b-header' : ''}`}>
              <span>Round 2 (Byes + R1)</span>
              <span>{round2Matches.length} Ties</span>
            </div>
            {round2Matches.map(m => (
              <div 
                key={m.id} 
                className="tree-fixture-node" 
                onClick={() => onSelectMatch && onSelectMatch(m)} 
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontWeight: 800, marginBottom: 4 }}>
                  <span>M{m.match_number}</span>
                  <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.home_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.home_team_seed ? `#${m.home_team_seed} ` : (m.home_source_type === 'BYE' && !m.home_team_seed ? `#${m.home_source_val} ` : '')}
                    {m.home_source_type === 'BYE' && <span className="badge badge-bye" style={{ padding: '1px 4px', fontSize: 9, marginRight: 4 }}>BYE</span>}
                    {m.home_team_name || m.home_name || (m.home_source_type === 'BYE' ? `Bye Team (Seed #${m.home_source_val})` : `Winner M${m.home_source_val}`)}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.home_score : '-'}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.away_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.away_team_seed ? `#${m.away_team_seed} ` : ''}
                    {m.away_team_name || m.away_name || `Winner M${m.away_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.away_score : '-'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3: Round of 16 */}
          <div className="pool-round-column">
            <div className={`round-col-header ${activePool === 'B' ? 'pool-b-header' : ''}`}>
              <span>Round of 16</span>
              <span>{round16Matches.length} Ties</span>
            </div>
            {round16Matches.map(m => (
              <div 
                key={m.id} 
                className="tree-fixture-node" 
                onClick={() => onSelectMatch && onSelectMatch(m)} 
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontWeight: 800, marginBottom: 4 }}>
                  <span>M{m.match_number}</span>
                  <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.home_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.home_team_seed ? `#${m.home_team_seed} ` : ''}
                    {m.home_team_name || m.home_name || `Winner M${m.home_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.home_score : '-'}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.away_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.away_team_seed ? `#${m.away_team_seed} ` : ''}
                    {m.away_team_name || m.away_name || `Winner M${m.away_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.away_score : '-'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 4: Quarter-Finals */}
          <div className="pool-round-column">
            <div className={`round-col-header ${activePool === 'B' ? 'pool-b-header' : ''}`}>
              <span>Quarter-Finals</span>
              <span>{qfMatches.length} Ties</span>
            </div>
            {qfMatches.map(m => (
              <div 
                key={m.id} 
                className="tree-fixture-node" 
                onClick={() => onSelectMatch && onSelectMatch(m)} 
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontWeight: 800, marginBottom: 4 }}>
                  <span>M{m.match_number}</span>
                  <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.home_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.home_team_seed ? `#${m.home_team_seed} ` : ''}
                    {m.home_team_name || m.home_name || `Winner M${m.home_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.home_score : '-'}</span>
                </div>
                <div className={`tree-team-row ${m.winner_team_id == m.away_team_id ? 'winner' : ''}`}>
                  <span>
                    {m.away_team_seed ? `#${m.away_team_seed} ` : ''}
                    {m.away_team_name || m.away_name || `Winner M${m.away_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{m.status !== 'Pending' ? m.away_score : '-'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 5: Semi-Final (Pool Champion) */}
          {sfMatch && (
            <div className="pool-round-column">
              <div className="round-col-header" style={{ color: '#2563eb', borderBottomColor: '#93c5fd' }}>
                <span>Pool Semi-Final</span>
                <span>Grand Final Ticket</span>
              </div>
              <div 
                className="tree-fixture-node" 
                onClick={() => onSelectMatch && onSelectMatch(sfMatch)} 
                style={{ cursor: 'pointer', border: '2px solid #3b82f6', background: '#eff6ff' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#1d4ed8', fontWeight: 900, marginBottom: 4 }}>
                  <span>MATCH {sfMatch.match_number}</span>
                  <span className={`badge badge-${sfMatch.status.toLowerCase()}`}>{sfMatch.status}</span>
                </div>
                <div className={`tree-team-row ${sfMatch.winner_team_id == sfMatch.home_team_id ? 'winner' : ''}`}>
                  <span>
                    {sfMatch.home_team_seed ? `#${sfMatch.home_team_seed} ` : ''}
                    {sfMatch.home_team_name || sfMatch.home_name || `Winner M${sfMatch.home_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{sfMatch.status !== 'Pending' ? sfMatch.home_score : '-'}</span>
                </div>
                <div className={`tree-team-row ${sfMatch.winner_team_id == sfMatch.away_team_id ? 'winner' : ''}`}>
                  <span>
                    {sfMatch.away_team_seed ? `#${sfMatch.away_team_seed} ` : ''}
                    {sfMatch.away_team_name || sfMatch.away_name || `Winner M${sfMatch.away_source_val}`}
                  </span>
                  <span style={{ fontWeight: 900 }}>{sfMatch.status !== 'Pending' ? sfMatch.away_score : '-'}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: '#2563eb', fontWeight: 800, textAlign: 'center' }}>
                  Advances to Grand Final M53
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Roster of 27 Teams in this Pool */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Users size={18} color="#059669" /> All 27 Participating Teams in Pool {activePool}
        </h3>
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
          {teams.map((t, idx) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: idx < teams.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 32, fontSize: 12, fontWeight: 900, color: '#64748b' }}>#{t.seed_number}</span>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{t.name}</span>
              </div>
              {t.is_bye == 1 && <span className="badge badge-bye">Bye (Enters M{t.bye_target_match})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Pool Matches List */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>
          Pool {activePool} Fixtures List
        </h3>
        {matches.map(m => (
          <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
        ))}
      </div>
    </div>
  );
}
