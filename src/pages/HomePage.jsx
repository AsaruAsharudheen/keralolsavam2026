import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { Trophy, RefreshCw, Award, ChevronRight, Users, Shield } from 'lucide-react';

export default function HomePage({ onSelectMatch, onNavigate }) {
  const { data: statsData, loading: statsLoading, lastUpdated, refetch } = useAutoPolling(api.getDashboardStats, 8000);
  const { data: matchesData } = useAutoPolling(() => api.getMatches({ status: 'Pending' }), 12000);
  const { data: scorersData } = useAutoPolling(api.getTopScorers, 15000);

  const stats = statsData?.stats;
  const currentRunning = statsData?.current_live || [];
  const latestResults = statsData?.latest_results || [];
  const pendingMatches = matchesData?.matches?.slice(0, 4) || [];
  const topScorers = scorersData?.scorers?.slice(0, 5) || [];

  return (
    <div className="container">
      {/* Live Polling Alert Bar */}
      <div className="polling-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse-dot"></span>
          <span>Automatic Live Update System Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontSize: 11, fontWeight: 700 }}>
          <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Syncing...'}</span>
          <button onClick={refetch} style={{ background: 'none', border: 'none', color: '#059669', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={13} className={statsLoading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-tag">
          <Trophy size={14} /> Official Tournament Portal
        </div>
        <h1 className="hero-title">Nellaya Keralolsavam 2026</h1>
        <p className="hero-subtitle">
          Gramapanchayat Football Tournament · 54 Teams · Two Pools · 53 Knockout Fixtures
        </p>

        {/* Official Tournament Poster Showcase */}
        <div className="tournament-poster-card">
          <div className="tournament-poster-wrap">
            <img 
              src="/ads.jpeg" 
              alt="Nellaya Gramapanchayat Keralolsavam 2026 Football Tournament Poster" 
              className="tournament-poster-img"
              loading="eager"
            />
          </div>
          <div className="tournament-poster-caption">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#059669', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <Trophy size={16} /> Official Tournament Fixture Schedule
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Marayamangalam School Turf · 24, 25, 26 Dates
            </div>
          </div>
        </div>

        {stats?.champion && (
          <div style={{ margin: '14px auto', maxWidth: 450, padding: 14, background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 14 }}>
            <div style={{ color: '#b45309', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Award size={18} /> TOURNAMENT CHAMPION
            </div>
            <div style={{ color: '#0f172a', fontSize: 22, fontWeight: 900, marginTop: 4 }}>
              {stats.champion.champion_name}
            </div>
          </div>
        )}

        {/* Hero Quick Stats */}
        <div className="hero-stats-row">
          <div className="stat-item">
            <div className="stat-val">{stats?.total_teams ?? 54}</div>
            <div className="stat-lbl">Teams</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#059669' }}>{stats?.pool_a_teams ?? 27}</div>
            <div className="stat-lbl">Pool A</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#2563eb' }}>{stats?.pool_b_teams ?? 27}</div>
            <div className="stat-lbl">Pool B</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#d97706' }}>{stats?.total_matches ?? 53}</div>
            <div className="stat-lbl">Fixtures</div>
          </div>
        </div>
      </div>

      {/* Live & Halftime Matches Section */}
      {currentRunning.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="pulse-dot"></span>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Live & Running Matches</h2>
            <span className="badge badge-running">{currentRunning.length} Active</span>
          </div>
          {currentRunning.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))}
        </div>
      )}

      {/* Pool Model Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
        <div 
          onClick={() => onNavigate('pools', 'A')}
          style={{ 
            background: '#ffffff', 
            border: '2px solid #a7f3d0', 
            borderRadius: 16, 
            padding: '18px 16px', 
            cursor: 'pointer',
            boxShadow: 'var(--card-shadow)',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="badge badge-pool-a" style={{ marginBottom: 8 }}>Pool A Model</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>27 Teams · 5 Byes</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Knockout Semi: M51</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#059669', fontSize: 13, fontWeight: 800 }}>
            <span>View Pool A Fixture Tree</span>
            <ChevronRight size={15} />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('pools', 'B')}
          style={{ 
            background: '#ffffff', 
            border: '2px solid #bfdbfe', 
            borderRadius: 16, 
            padding: '18px 16px', 
            cursor: 'pointer',
            boxShadow: 'var(--card-shadow)',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="badge badge-pool-b" style={{ marginBottom: 8 }}>Pool B Model</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>27 Teams · 5 Byes</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Knockout Semi: M52</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#2563eb', fontSize: 13, fontWeight: 800 }}>
            <span>View Pool B Fixture Tree</span>
            <ChevronRight size={15} />
          </div>
        </div>
      </div>

      {/* Latest Completed Results */}
      {latestResults.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Completed Results</h2>
            <button onClick={() => onNavigate('fixtures', { status: 'Completed' })} style={{ background: 'none', color: '#059669', fontSize: 13, fontWeight: 800 }}>
              View All
            </button>
          </div>
          {latestResults.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))}
        </div>
      )}

      {/* Pending Fixtures */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Pending Fixtures</h2>
          <button onClick={() => onNavigate('fixtures', { status: 'Pending' })} style={{ background: 'none', color: '#059669', fontSize: 13, fontWeight: 800 }}>
            Full Schedule
          </button>
        </div>
        {pendingMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 14 }}>
            No pending fixtures remaining.
          </div>
        ) : (
          pendingMatches.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))
        )}
      </div>

      {/* Top Scorers */}
      {topScorers.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Top Goal Scorers</h2>
            <button onClick={() => onNavigate('scorers')} style={{ background: 'none', color: '#059669', fontSize: 13, fontWeight: 800 }}>
              Full Leaderboard
            </button>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
            {topScorers.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: idx < topScorers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: idx === 0 ? '#f59e0b' : '#f1f5f9', color: idx === 0 ? '#ffffff' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>
                    {s.rank}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>{s.player_name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{s.team_name} (Pool {s.pool_code})</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#059669' }}>{s.total_goals}</span>
                  <span style={{ fontSize: 11, color: '#64748b', marginLeft: 4, fontWeight: 700 }}>goals</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
