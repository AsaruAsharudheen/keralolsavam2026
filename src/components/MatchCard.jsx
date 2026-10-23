import React from 'react';
import { Shield, Clock, MapPin, ChevronRight, Trophy } from 'lucide-react';

export default function MatchCard({ match, onClick }) {
  const isHalftime = match.status === 'Half-time' || match.status === 'Halftime';
  const isRunning = match.status === 'Running' || match.status === 'Live';
  const isLiveActive = isRunning || isHalftime;
  const isCompleted = match.status === 'Completed' || match.status === 'Finished' || match.status === 'Full-time';
  const isPending = match.status === 'Pending' || match.status === 'Upcoming';

  const homeWon = isCompleted && match.winner_team_id && String(match.winner_team_id) === String(match.home_team_id);
  const awayWon = isCompleted && match.winner_team_id && String(match.winner_team_id) === String(match.away_team_id);

  // Label helpers for knockout source (Team 1 and Team 2)
  const getTeam1Label = () => {
    if (match.home_team_name) return match.home_team_name;
    if (match.home_name) return match.home_name;
    if (match.home_source_type === 'BYE') return `Bye Team (Seed #${match.home_source_val})`;
    if (match.home_source_type === 'WINNER') return `Winner of M${match.home_source_val}`;
    return 'Team 1 (TBD)';
  };

  const getTeam2Label = () => {
    if (match.away_team_name) return match.away_team_name;
    if (match.away_name) return match.away_name;
    if (match.away_source_type === 'BYE') return `Bye Team (Seed #${match.away_source_val})`;
    if (match.away_source_type === 'WINNER') return `Winner of M${match.away_source_val}`;
    return 'Team 2 (TBD)';
  };

  return (
    <div 
      className={`knockout-match-card ${isRunning ? 'is-running' : ''} ${isHalftime ? 'is-halftime' : ''}`}
      onClick={() => onClick && onClick(match)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Top Header Row */}
      <div className="knockout-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span className="knockout-match-badge">
            M{match.match_number}
          </span>
          <span className="knockout-round-title">{match.round_name}</span>
          {match.pool_code && (
            <span className={`badge badge-pool-${match.pool_code.toLowerCase()}`}>
              Pool {match.pool_code}
            </span>
          )}
        </div>

        <div>
          {isHalftime && (
            <span className="badge badge-halftime">
              <span className="pulse-dot-orange"></span>
              HALFTIME
            </span>
          )}
          {isRunning && (
            <span className="badge badge-running">
              <span className="pulse-dot"></span>
              RUNNING
            </span>
          )}
          {isCompleted && <span className="badge badge-completed">COMPLETED</span>}
          {isPending && <span className="badge badge-pending">PENDING</span>}
        </div>
      </div>

      {/* Knockout Pair (Team 1 vs Team 2 Bracket Slot) */}
      <div className="knockout-pairing-box">
        {/* Team 1 Slot */}
        <div className={`knockout-team-slot ${homeWon ? 'is-winner' : ''}`}>
          <div className="team-slot-info">
            <span className="slot-seed-pill">
              {match.home_team_seed ? `#${match.home_team_seed}` : (match.home_source_type === 'WINNER' ? `W${match.home_source_val}` : 'T1')}
            </span>
            <span className="team-slot-title">
              {getTeam1Label()}
            </span>
          </div>

          <div className="team-slot-score">
            {isCompleted || isLiveActive ? (
              <span className={`score-digit ${homeWon ? 'winner-score' : ''}`}>{match.home_score}</span>
            ) : (
              <span className="score-pending">-</span>
            )}
          </div>
        </div>

        {/* Mid Divider / Knockout Line */}
        <div className="knockout-slot-divider">
          <span className="vs-center-tag">VS</span>
        </div>

        {/* Team 2 Slot */}
        <div className={`knockout-team-slot ${awayWon ? 'is-winner' : ''}`}>
          <div className="team-slot-info">
            <span className="slot-seed-pill">
              {match.away_team_seed ? `#${match.away_team_seed}` : (match.away_source_type === 'WINNER' ? `W${match.away_source_val}` : 'T2')}
            </span>
            <span className="team-slot-title">
              {getTeam2Label()}
            </span>
          </div>

          <div className="team-slot-score">
            {isCompleted || isLiveActive ? (
              <span className={`score-digit ${awayWon ? 'winner-score' : ''}`}>{match.away_score}</span>
            ) : (
              <span className="score-pending">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Extra Time / Penalties Callout */}
      {match.is_penalties == 1 && (
        <div style={{ padding: '4px 12px', background: '#fffbeb', fontSize: 11, fontWeight: 800, color: '#b45309', borderTop: '1px solid #fde68a', textAlign: 'center' }}>
          Penalty Shootout: {match.home_penalty_score} - {match.away_penalty_score}
        </div>
      )}
    </div>
  );
}
