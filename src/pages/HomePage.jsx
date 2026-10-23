import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { Trophy, RefreshCw, Flame, Calendar, Award, ChevronRight } from 'lucide-react';

export default function HomePage({ onSelectMatch, onNavigate }) {
  const { data: statsData, loading: statsLoading, lastUpdated, refetch } = useAutoPolling(api.getDashboardStats, 8000);
  const { data: matchesData } = useAutoPolling(() => api.getMatches({ status: 'Upcoming' }), 12000);
  const { data: scorersData } = useAutoPolling(api.getTopScorers, 15000);

  const stats = statsData?.stats;
  const currentLive = statsData?.current_live || [];
  const latestResults = statsData?.latest_results || [];
  const upcomingMatches = matchesData?.matches?.slice(0, 4) || [];
  const topScorers = scorersData?.scorers?.slice(0, 5) || [];

  return (
    <div className="container">
      {/* Live Polling Alert Bar */}
      <div className="polling-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pulse-dot"></span>
          <span>Live Automatic Refresh Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 11 }}>
          <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Syncing...'}</span>
          <button onClick={refetch} style={{ background: 'none', border: 'none', color: '#10b981', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={12} className={statsLoading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-tag">
          <Trophy size={14} /> Official Fixture & Tournament Center
        </div>
        <h1 className="hero-title">Nellaya Keralolsavam 2026</h1>
        <p className="hero-subtitle">
          Gramapanchayat Football Tournament · 54 Teams · Two Pools · 53 Knockout Fixtures
        </p>

        {stats?.champion && (
          <div style={{ margin: '14px auto', maxWidth: 450, padding: 12, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 12 }}>
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Award size={18} /> TOURNAMENT CHAMPION
            </div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginTop: 4 }}>
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
            <div className="stat-val" style={{ color: '#34d399' }}>{stats?.pool_a_teams ?? 27}</div>
            <div className="stat-lbl">Pool A</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#60a5fa' }}>{stats?.pool_b_teams ?? 27}</div>
            <div className="stat-lbl">Pool B</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{ color: '#fbbf24' }}>{stats?.total_matches ?? 53}</div>
            <div className="stat-lbl">Matches</div>
          </div>
        </div>
      </div>

      {/* Live Matches Section */}
      {currentLive.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="pulse-dot" style={{ backgroundColor: '#ef4444' }}></span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Live Now</h2>
            <span className="badge badge-live">{currentLive.length} Matches</span>
          </div>
          {currentLive.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))}
        </div>
      )}

      {/* Pool Navigation Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div 
          onClick={() => onNavigate('pools', 'A')}
          style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 28, 63, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 14, padding: '16px 14px', cursor: 'pointer' }}
        >
          <div className="badge badge-pool-a" style={{ marginBottom: 8 }}>Pool A Fixtures</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>27 Teams · 5 Byes</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Semi-Finalist: M51</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#34d399', fontSize: 12, fontWeight: 700 }}>
            <span>Explore Pool A</span>
            <ChevronRight size={14} />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('pools', 'B')}
          style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15, 28, 63, 0.8) 100%)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: 14, padding: '16px 14px', cursor: 'pointer' }}
        >
          <div className="badge badge-pool-b" style={{ marginBottom: 8 }}>Pool B Fixtures</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>27 Teams · 5 Byes</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Semi-Finalist: M52</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#60a5fa', fontSize: 12, fontWeight: 700 }}>
            <span>Explore Pool B</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Latest Completed Results */}
      {latestResults.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Latest Results</h2>
            <button onClick={() => onNavigate('fixtures', { status: 'Full-time' })} style={{ background: 'none', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
              View All
            </button>
          </div>
          {latestResults.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))}
        </div>
      )}

      {/* Upcoming Fixtures */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Upcoming Fixtures</h2>
          <button onClick={() => onNavigate('fixtures', { status: 'Upcoming' })} style={{ background: 'none', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
            Full Schedule
          </button>
        </div>
        {upcomingMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', background: 'var(--bg-surface)', borderRadius: 12 }}>
            No upcoming fixtures pending.
          </div>
        ) : (
          upcomingMatches.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))
        )}
      </div>

      {/* Top Scorers Preview */}
      {topScorers.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Golden Boot Standings</h2>
            <button onClick={() => onNavigate('scorers')} style={{ background: 'none', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
              Full Table
            </button>
          </div>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
            {topScorers.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: idx < topScorers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: idx === 0 ? '#fbbf24' : '#334155', color: idx === 0 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>
                    {s.rank}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{s.player_name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.team_name} (Pool {s.pool_code})</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{s.total_goals}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>goals</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
