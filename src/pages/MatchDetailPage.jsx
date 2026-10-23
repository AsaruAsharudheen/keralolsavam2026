import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trophy, Clock, MapPin, ArrowLeft, Shield, Award, Calendar, AlertCircle } from 'lucide-react';

export default function MatchDetailPage({ matchId, matchNumber, onBack }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    try {
      const res = await api.getMatch(matchNumber || matchId, !!matchNumber);
      if (res && res.success) {
        setMatch(res.match);
      } else {
        setError(res?.message || 'Match not found');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    const interval = setInterval(fetchDetail, 8000);
    return () => clearInterval(interval);
  }, [matchId, matchNumber]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
        Loading match details...
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: 16 }}>
          <ArrowLeft size={16} /> Back to Fixtures
        </button>
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 20, color: '#fca5a5' }}>
          {error || 'Match information unavailable'}
        </div>
      </div>
    );
  }

  const isLive = match.status === 'Live';
  const isHalftime = match.status === 'Half-time';
  const isCompleted = match.status === 'Full-time';
  const events = match.events || [];

  return (
    <div className="container">
      {/* Back button */}
      <div style={{ margin: '14px 0 12px' }}>
        <button onClick={onBack} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Match Centerpiece Card */}
      <div style={{ 
        background: 'linear-gradient(180deg, #152554 0%, #0c1736 100%)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 16, 
        padding: '20px 16px',
        marginBottom: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        {/* Match Header Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="badge" style={{ background: '#1e293b', color: '#38bdf8' }}>Match {match.match_number}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{match.round_name}</span>
            {match.pool_code && (
              <span className={`badge badge-pool-${match.pool_code.toLowerCase()}`}>
                Pool {match.pool_code}
              </span>
            )}
          </div>

          <div>
            {isLive && (
              <span className="badge badge-live">
                <span className="pulse-dot" style={{ backgroundColor: '#fff', width: 6, height: 6 }}></span>
                LIVE NOW
              </span>
            )}
            {isHalftime && <span className="badge badge-halftime">HALF TIME</span>}
            {isCompleted && <span className="badge badge-fulltime">FULL TIME</span>}
            {match.status === 'Upcoming' && <span className="badge badge-upcoming">UPCOMING</span>}
          </div>
        </div>

        {/* Head-to-head score and team names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12, padding: '12px 0' }}>
          {/* Home Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} color="#10b981" />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              {match.home_team_seed ? `SEED #${match.home_team_seed}` : (match.home_source_type === 'WINNER' ? `WINNER M${match.home_source_val}` : 'TBD')}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {match.home_team_name || (match.home_source_type === 'WINNER' ? `Winner of M${match.home_source_val}` : 'To Be Decided')}
            </div>
            {match.winner_team_id && String(match.winner_team_id) === String(match.home_team_id) && (
              <div style={{ color: '#34d399', fontSize: 11, fontWeight: 800, marginTop: 4 }}>★ WINNER</div>
            )}
          </div>

          {/* Scores */}
          <div style={{ textAlign: 'center' }}>
            {isCompleted || isLive || isHalftime ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{match.home_score}</span>
                  <span style={{ fontSize: 24, opacity: 0.4, color: '#fff' }}>-</span>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>{match.away_score}</span>
                </div>
                {match.is_penalties == 1 && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#fbbf24', fontWeight: 800 }}>
                    Penalties: {match.home_penalty_score} - {match.away_penalty_score}
                  </div>
                )}
                {isHalftime && (
                  <div style={{ marginTop: 4, fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
                    HT ({match.home_halftime_score ?? match.home_score}-{match.away_halftime_score ?? match.away_score})
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8' }}>VS</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                  {match.match_time ? match.match_time.slice(0, 5) : '07:30'}
                </div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', border: '2px solid rgba(59, 130, 246, 0.4)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} color="#3b82f6" />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
              {match.away_team_seed ? `SEED #${match.away_team_seed}` : (match.away_source_type === 'WINNER' ? `WINNER M${match.away_source_val}` : 'TBD')}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {match.away_team_name || (match.away_source_type === 'WINNER' ? `Winner of M${match.away_source_val}` : 'To Be Decided')}
            </div>
            {match.winner_team_id && String(match.winner_team_id) === String(match.away_team_id) && (
              <div style={{ color: '#34d399', fontSize: 11, fontWeight: 800, marginTop: 4 }}>WINNER ★</div>
            )}
          </div>
        </div>

        {/* Match Logistics */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: 12, color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} color="#10b981" />
            <span>{match.venue || 'Nellaya Ground'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} color="#38bdf8" />
            <span>{match.match_date || '2026-11-01'} · {match.match_time ? match.match_time.slice(0, 5) : '07:30'}</span>
          </div>
          {match.next_match_number && (
            <div style={{ color: '#fbbf24', fontWeight: 700 }}>
              Winner advances to M{match.next_match_number} ({match.next_match_slot})
            </div>
          )}
        </div>
      </div>

      {/* Goal Timeline & Events */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Match Timeline & Goal Events
        </h3>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 16 }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 13 }}>
              No goals or match events recorded yet.
            </div>
          ) : (
            events.map((ev, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: idx < events.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ width: 44, fontSize: 13, fontWeight: 900, color: '#10b981', textAlign: 'right' }}>
                  {ev.minute}'{ev.extra_minute ? `+${ev.extra_minute}` : ''}
                </div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: ev.event_type.includes('CARD') ? '#ef4444' : '#10b981' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>
                    {ev.player_name || ev.player_name_custom || 'Goal'}
                    <span className="badge" style={{ marginLeft: 8, fontSize: 10, background: 'rgba(255,255,255,0.1)' }}>
                      {ev.event_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    {ev.team_name} {ev.description ? `· ${ev.description}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Official Confirmation Snapshot */}
      {match.result_snapshot && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
            <Award size={16} /> Official Result Confirmed & Recorded
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1' }}>
            Confirmed by: <strong>{match.result_snapshot.confirmed_by_name || 'Tournament Official'}</strong> at {match.result_snapshot.confirmed_at}
          </div>
          {match.result_snapshot.summary && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Note: {match.result_snapshot.summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
