import React from 'react';
import { Trophy, Shield, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

export default function MatchCard({ match, onClick }) {
  const isLive = match.status === 'Live';
  const isHalftime = match.status === 'Half-time';
  const isCompleted = match.status === 'Full-time';

  const homeWon = isCompleted && match.winner_team_id && String(match.winner_team_id) === String(match.home_team_id);
  const awayWon = isCompleted && match.winner_team_id && String(match.winner_team_id) === String(match.away_team_id);

  return (
    <div 
      className={`match-card ${isLive ? 'is-live' : ''}`}
      onClick={() => onClick && onClick(match)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="match-card-header">
        <div className="match-card-meta">
          <span className="badge" style={{ background: '#1e293b', color: '#38bdf8' }}>
            M{match.match_number}
          </span>
          <span style={{ fontWeight: 600 }}>{match.round_name}</span>
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
              LIVE
            </span>
          )}
          {isHalftime && <span className="badge badge-halftime">HT</span>}
          {isCompleted && <span className="badge badge-fulltime">FT</span>}
          {match.status === 'Upcoming' && <span className="badge badge-upcoming">Upcoming</span>}
          {match.status === 'Postponed' && <span className="badge" style={{ background: '#78350f', color: '#fde68a' }}>Postponed</span>}
        </div>
      </div>

      <div className="match-teams-grid">
        {/* Home Team */}
        <div className="team-box">
          <div className="team-seed">
            {match.home_team_seed ? `#${match.home_team_seed}` : (match.home_source_type === 'WINNER' ? `Winner M${match.home_source_val}` : 'TBD')}
          </div>
          <div className={`team-name ${homeWon ? 'winner' : ''}`}>
            {match.home_team_name || (match.home_source_type === 'WINNER' ? `Winner of M${match.home_source_val}` : 'To Be Decided')}
          </div>
          {homeWon && <div style={{ fontSize: 10, color: '#34d399', fontWeight: 800 }}>★ WINNER</div>}
        </div>

        {/* Score Display */}
        <div className="match-score-center">
          {isCompleted || isLive || isHalftime ? (
            <>
              <div className={`score-display ${isLive ? 'live-score' : ''}`}>
                <span>{match.home_score}</span>
                <span style={{ opacity: 0.4 }}>-</span>
                <span>{match.away_score}</span>
              </div>
              {match.is_penalties == 1 && (
                <div className="score-sub">
                  PK: {match.home_penalty_score} - {match.away_penalty_score}
                </div>
              )}
              {isHalftime && (
                <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 2, fontWeight: 700 }}>
                  HT ({match.home_halftime_score ?? match.home_score}-{match.away_halftime_score ?? match.away_score})
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8' }}>VS</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{match.match_time ? match.match_time.slice(0, 5) : '07:30'}</div>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="team-box away">
          <div className="team-seed">
            {match.away_team_seed ? `#${match.away_team_seed}` : (match.away_source_type === 'WINNER' ? `Winner M${match.away_source_val}` : 'TBD')}
          </div>
          <div className={`team-name ${awayWon ? 'winner' : ''}`}>
            {match.away_team_name || (match.away_source_type === 'WINNER' ? `Winner of M${match.away_source_val}` : 'To Be Decided')}
          </div>
          {awayWon && <div style={{ fontSize: 10, color: '#34d399', fontWeight: 800 }}>WINNER ★</div>}
        </div>
      </div>

      <div className="match-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={12} color="#64748b" />
          <span>{match.venue || 'Nellaya Ground'}</span>
        </div>
        {match.next_match_number && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8' }}>
            <span>Advances to M{match.next_match_number}</span>
            <ChevronRight size={12} />
          </div>
        )}
      </div>
    </div>
  );
}
