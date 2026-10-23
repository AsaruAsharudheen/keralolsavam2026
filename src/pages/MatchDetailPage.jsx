import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, ArrowLeft, Award, MapPin, Clock } from 'lucide-react';

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
      <div className="container" style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
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
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20, color: '#dc2626' }}>
          {error || 'Match information unavailable'}
        </div>
      </div>
    );
  }

  const isRunning = match.status === 'Running' || match.status === 'Live' || match.status === 'Half-time';
  const isCompleted = match.status === 'Completed' || match.status === 'Full-time';
  const isPending = match.status === 'Pending' || match.status === 'Upcoming';
  const events = match.events || [];

  return (
    <div className="container">
      <div style={{ margin: '14px 0 12px' }}>
        <button onClick={onBack} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Match Centerpiece Card */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid var(--border-color)', 
        borderRadius: 18, 
        padding: '24px 20px',
        marginBottom: 20,
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>Match {match.match_number}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{match.round_name}</span>
            {match.pool_code && (
              <span className={`badge badge-pool-${match.pool_code.toLowerCase()}`}>
                Pool {match.pool_code}
              </span>
            )}
          </div>

          <div>
            {isRunning && (
              <span className="badge badge-running">
                <span className="pulse-dot"></span>
                RUNNING NOW
              </span>
            )}
            {isCompleted && <span className="badge badge-completed">COMPLETED</span>}
            {isPending && <span className="badge badge-pending">PENDING</span>}
          </div>
        </div>

        {/* Head-to-head score and team names */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 14, padding: '12px 0' }}>
          {/* Home Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #a7f3d0', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={26} color="#059669" />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>
              {match.home_team_seed ? `SEED #${match.home_team_seed}` : (match.home_source_type === 'WINNER' ? `WINNER M${match.home_source_val}` : 'TBD')}
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginTop: 3 }}>
              {match.home_team_name || (match.home_source_type === 'WINNER' ? `Winner of M${match.home_source_val}` : 'To Be Decided')}
            </div>
            {match.winner_team_id && String(match.winner_team_id) === String(match.home_team_id) && (
              <div style={{ color: '#059669', fontSize: 12, fontWeight: 900, marginTop: 4 }}>★ WINNER</div>
            )}
          </div>

          {/* Scores */}
          <div style={{ textAlign: 'center' }}>
            {isCompleted || isRunning ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f8fafc', padding: '10px 18px', borderRadius: 14, border: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#0f172a' }}>{match.home_score}</span>
                  <span style={{ fontSize: 26, opacity: 0.35, color: '#64748b' }}>-</span>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#0f172a' }}>{match.away_score}</span>
                </div>
                {match.is_penalties == 1 && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#d97706', fontWeight: 900 }}>
                    Penalties: {match.home_penalty_score} - {match.away_penalty_score}
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: '#f8fafc', padding: '10px 18px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#64748b' }}>VS</div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={26} color="#2563eb" />
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>
              {match.away_team_seed ? `SEED #${match.away_team_seed}` : (match.away_source_type === 'WINNER' ? `WINNER M${match.away_source_val}` : 'TBD')}
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginTop: 3 }}>
              {match.away_team_name || (match.away_source_type === 'WINNER' ? `Winner of M${match.away_source_val}` : 'To Be Decided')}
            </div>
            {match.winner_team_id && String(match.winner_team_id) === String(match.away_team_id) && (
              <div style={{ color: '#059669', fontSize: 12, fontWeight: 900, marginTop: 4 }}>WINNER ★</div>
            )}
          </div>
        </div>

        {/* Logistics */}
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: 13, color: '#475569', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={15} color="#059669" />
            <span>{match.venue || 'Nellaya Ground'}</span>
          </div>
          {match.next_match_number && (
            <div style={{ color: '#d97706', fontWeight: 800 }}>
              Winner advances to M{match.next_match_number}
            </div>
          )}
        </div>
      </div>

      {/* Goal Timeline & Events */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>
          Match Timeline & Goal Events
        </h3>
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 16, padding: 18, boxShadow: 'var(--card-shadow)' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: 13 }}>
              No goals or match events recorded yet.
            </div>
          ) : (
            events.map((ev, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: idx < events.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: ev.event_type?.includes('CARD') ? '#dc2626' : '#059669' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 14 }}>
                    {ev.player_name || ev.player_name_custom || 'Goal'}
                    <span className="badge badge-pending" style={{ marginLeft: 8, fontSize: 10 }}>
                      {ev.event_type?.replace('_', ' ') || 'GOAL'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {ev.team_name} {ev.description ? `· ${ev.description}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
