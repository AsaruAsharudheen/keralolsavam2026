import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Award, Plus, Trash2, Check, RefreshCw } from 'lucide-react';

export default function AdminScoreManager({ token }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Score states
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchStatus, setMatchStatus] = useState('Pending');

  // Penalties if draw
  const [homePK, setHomePK] = useState('');
  const [awayPK, setAwayPK] = useState('');
  const [isPenalties, setIsPenalties] = useState(false);

  // Toss Winner (Round 1 draw, or Round 2+ if penalties also draw)
  const [tossWinnerId, setTossWinnerId] = useState('');

  // Goal recording state: ONLY Team and Scorer Name (minute, eventtype, note removed)
  const [eventTeamId, setEventTeamId] = useState('');
  const [eventPlayerName, setEventPlayerName] = useState('');

  const loadMatches = async () => {
    try {
      setLoading(true);
      const res = await api.getMatches({});
      if (res.success) {
        setMatches(res.matches);
        if (selectedMatch) {
          const updated = res.matches.find(m => m.id === selectedMatch.id);
          if (updated) loadMatchDetails(updated.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchDetails = async (id) => {
    try {
      const res = await api.getMatch(id);
      if (res.success) {
        const m = res.match;
        setSelectedMatch(m);
        setHomeScore(m.home_score);
        setAwayScore(m.away_score);
        // Normalize Halftime / Half-time for select dropdown
        let currentStatus = m.status;
        if (currentStatus === 'Half-time') currentStatus = 'Halftime';
        setMatchStatus(currentStatus);
        setHomePK(m.home_penalty_score !== null ? m.home_penalty_score : '');
        setAwayPK(m.away_penalty_score !== null ? m.away_penalty_score : '');
        setIsPenalties(m.is_penalties == 1);
        setTossWinnerId(m.toss_winner_team_id ? String(m.toss_winner_team_id) : (m.winner_team_id ? String(m.winner_team_id) : ''));
        if (m.home_team_id) setEventTeamId(m.home_team_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  // Update Status Dropdown Change (Pending, Running, Halftime, Completed)
  const handleStatusSelectChange = async (newStatus) => {
    setMatchStatus(newStatus);
    if (!selectedMatch) return;
    setSaving(true);
    setMsg(null);
    try {
      const tossParam = tossWinnerId ? parseInt(tossWinnerId) : null;
      const res = await api.updateMatchStatus(selectedMatch.id, newStatus, 'Status changed in admin', token, tossParam);
      if (res.success) {
        setMsg({ 
          type: 'success', 
          text: `Status updated to "${newStatus}"` + (res.progression ? ` · Winner advanced to M${res.progression.next_match_progression?.next_match_number || 'Next'}` : '') 
        });
        loadMatchDetails(selectedMatch.id);
        loadMatches();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Save Score changes
  const handleSaveScore = async () => {
    if (!selectedMatch) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await api.updateMatchScore({
        id: selectedMatch.id,
        home_score: parseInt(homeScore) || 0,
        away_score: parseInt(awayScore) || 0,
        home_halftime_score: null,
        away_halftime_score: null,
        home_penalty_score: homePK !== '' ? parseInt(homePK) : null,
        away_penalty_score: awayPK !== '' ? parseInt(awayPK) : null,
        is_penalties: isPenalties ? 1 : 0,
        toss_winner_team_id: tossWinnerId ? parseInt(tossWinnerId) : null
      }, token);

      if (res.success) {
        setMsg({ type: 'success', text: 'Scores saved successfully!' });
        loadMatchDetails(selectedMatch.id);
        loadMatches();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Simplified Goal Event: ONLY Team + Player Name
  const handleAddGoalEvent = async (e) => {
    e.preventDefault();
    if (!selectedMatch || !eventTeamId || !eventPlayerName.trim()) return;
    setSaving(true);
    try {
      const res = await api.addMatchEvent({
        match_id: selectedMatch.id,
        team_id: eventTeamId,
        player_name_custom: eventPlayerName.trim(),
        event_type: 'GOAL',
        minute: null,
        description: null
      }, token);

      if (res.success) {
        setEventPlayerName('');
        setMsg({ type: 'success', text: `Goal recorded for ${eventPlayerName.trim()}! Score updated automatically.` });
        loadMatchDetails(selectedMatch.id);
        loadMatches();
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Remove this goal?')) return;
    try {
      const res = await api.deleteMatchEvent(eventId, token);
      if (res.success) {
        loadMatchDetails(selectedMatch.id);
        loadMatches();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Score & Match Control</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Select any fixture M1 through M53 to change match status, update scores, and add player goals.
        </p>
      </div>

      {msg && (
        <div style={{ 
          background: msg.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${msg.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: msg.type === 'success' ? '#065f46' : '#b91c1c',
          padding: '12px 16px',
          borderRadius: 10,
          marginBottom: 16,
          fontSize: 13,
          fontWeight: 700
        }}>
          {msg.text}
        </div>
      )}

      {/* Match Selector Dropdown */}
      <div className="form-group">
        <label className="form-label">Select Match</label>
        <select 
          className="form-select" 
          value={selectedMatch ? selectedMatch.id : ''} 
          onChange={(e) => {
            if (e.target.value) loadMatchDetails(e.target.value);
            else setSelectedMatch(null);
          }}
          style={{ fontSize: 14, fontWeight: 700, padding: '12px 14px' }}
        >
          <option value="">-- Choose Match (M1 to M53) --</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              M{m.match_number}: {m.home_team_name || (m.home_source_type === 'WINNER' ? `Winner M${m.home_source_val}` : 'TBD')} vs {m.away_team_name || (m.away_source_type === 'WINNER' ? `Winner of M${m.away_source_val}` : 'TBD')} [{m.status}]
            </option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 16, padding: 20, marginTop: 16, boxShadow: 'var(--card-shadow)' }}>
          {/* Header of selected match */}
          <div className="admin-selected-match-header">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                <span className="badge" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', fontSize: 11, padding: '2px 8px' }}>
                  MATCH {selectedMatch.match_number}
                </span>
                <span className={`badge badge-${(selectedMatch.status || '').toLowerCase()}`}>
                  {selectedMatch.status}
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', lineHeight: 1.35, marginTop: 4 }}>
                {selectedMatch.home_team_name || 'TBD'} <span style={{ color: '#94a3b8', fontWeight: 600 }}>vs</span> {selectedMatch.away_team_name || 'TBD'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                Round: {selectedMatch.round_name} · Pool: {selectedMatch.pool_code || 'Final'} · Next: M{selectedMatch.next_match_number || 'Champion'}
              </div>
            </div>
          </div>

          {/* 1. MATCH STATUS SELECT DROPDOWN MODEL */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" style={{ fontSize: 13, color: '#0f172a' }}>Match Status (Select Option)</label>
            <select 
              className="form-select"
              value={matchStatus === 'Half-time' ? 'Halftime' : (matchStatus === 'Finished' ? 'Completed' : matchStatus)}
              onChange={(e) => handleStatusSelectChange(e.target.value)}
              style={{ fontSize: 15, fontWeight: 800, padding: '12px 14px', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <option value="Pending">Pending</option>
              <option value="Running">Running (Live)</option>
              <option value="Halftime">Halftime</option>
              <option value="Completed">Completed</option>
            </select>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              * When set to <strong>Completed</strong>, the match status and winner update directly in the database, automatically advancing the winner to the next round.
            </div>
          </div>

          {/* 2. SCORE COUNTERS */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', padding: 16, borderRadius: 14, marginBottom: 20 }}>
            <div className="admin-score-grid">
              {/* Home Team Card */}
              <div className="admin-score-card">
                <label className="form-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {selectedMatch.home_team_name || 'Home Team'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                  <button type="button" onClick={() => setHomeScore(Math.max(0, parseInt(homeScore || 0) - 1))} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 18, fontWeight: 900 }}>-</button>
                  <input type="number" min="0" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="form-input" style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, minWidth: 60, maxWidth: 90 }} />
                  <button type="button" onClick={() => setHomeScore(parseInt(homeScore || 0) + 1)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 18, fontWeight: 900 }}>+</button>
                </div>
              </div>

              {/* VS Divider */}
              <div className="admin-vs-badge">
                VS
              </div>

              {/* Away Team Card */}
              <div className="admin-score-card">
                <label className="form-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {selectedMatch.away_team_name || 'Away Team'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                  <button type="button" onClick={() => setAwayScore(Math.max(0, parseInt(awayScore || 0) - 1))} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 18, fontWeight: 900 }}>-</button>
                  <input type="number" min="0" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="form-input" style={{ textAlign: 'center', fontSize: 24, fontWeight: 900, minWidth: 60, maxWidth: 90 }} />
                  <button type="button" onClick={() => setAwayScore(parseInt(awayScore || 0) + 1)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 18, fontWeight: 900 }}>+</button>
                </div>
              </div>
            </div>

            {/* ROUND 1 TIE-BREAKER (DRAW -> TOSS ONLY) */}
            {selectedMatch && selectedMatch.match_number <= 22 && parseInt(homeScore) === parseInt(awayScore) && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #fed7aa', background: '#fff7ed', padding: '14px', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c2410c', fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
                  <span>🪙 Round 1 Rule: Match Draw ({homeScore}-{awayScore}) ➔ Toss Winner Only</span>
                </div>
                <p style={{ fontSize: 12, color: '#9a3412', marginBottom: 10 }}>
                  In Round 1 preliminary matches, there are no penalty shootouts. Select which team won the coin toss:
                </p>
                <select 
                  className="form-select"
                  value={tossWinnerId}
                  onChange={(e) => setTossWinnerId(e.target.value)}
                  style={{ background: '#ffffff', borderColor: '#fb923c', fontWeight: 800, color: '#7c2d12' }}
                >
                  <option value="">-- Select Coin Toss Winner --</option>
                  {selectedMatch.home_team_id && <option value={selectedMatch.home_team_id}>{selectedMatch.home_team_name} (Toss Winner)</option>}
                  {selectedMatch.away_team_id && <option value={selectedMatch.away_team_id}>{selectedMatch.away_team_name} (Toss Winner)</option>}
                </select>
              </div>
            )}

            {/* ROUND 2 ONWARDS TIE-BREAKER (DRAW -> PENALTIES, THEN IF DRAW -> TOSS) */}
            {selectedMatch && selectedMatch.match_number > 22 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>⚽ Penalty Shootout (Round 2+ If Draw)</span>
                </label>
                <div className="admin-penalties-grid">
                  <input 
                    type="number" 
                    placeholder="Home Penalties" 
                    value={homePK} 
                    onChange={(e) => { setHomePK(e.target.value); setIsPenalties(true); }} 
                    className="form-input" 
                    style={{ padding: '10px' }} 
                  />
                  <input 
                    type="number" 
                    placeholder="Away Penalties" 
                    value={awayPK} 
                    onChange={(e) => { setAwayPK(e.target.value); setIsPenalties(true); }} 
                    className="form-input" 
                    style={{ padding: '10px' }} 
                  />
                </div>

                {/* If Penalties are also Tied in Round 2+ -> Toss Decides */}
                {parseInt(homeScore) === parseInt(awayScore) && homePK !== '' && awayPK !== '' && parseInt(homePK) === parseInt(awayPK) && (
                  <div style={{ marginTop: 12, background: '#fff7ed', border: '1px solid #fdba74', padding: '12px', borderRadius: 10 }}>
                    <div style={{ color: '#c2410c', fontWeight: 900, fontSize: 13, marginBottom: 4 }}>
                      🪙 Penalties Tied ({homePK}-{awayPK}) ➔ Coin Toss Decider
                    </div>
                    <p style={{ fontSize: 12, color: '#9a3412', marginBottom: 8 }}>
                      Penalties ended in a tie. Select which team won the coin toss:
                    </p>
                    <select 
                      className="form-select"
                      value={tossWinnerId}
                      onChange={(e) => setTossWinnerId(e.target.value)}
                      style={{ background: '#ffffff', borderColor: '#fb923c', fontWeight: 800, color: '#7c2d12' }}
                    >
                      <option value="">-- Select Coin Toss Winner --</option>
                      {selectedMatch.home_team_id && <option value={selectedMatch.home_team_id}>{selectedMatch.home_team_name} (Toss Winner)</option>}
                      {selectedMatch.away_team_id && <option value={selectedMatch.away_team_id}>{selectedMatch.away_team_name} (Toss Winner)</option>}
                    </select>
                  </div>
                )}
              </div>
            )}

            <button onClick={handleSaveScore} disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>
              Save Score Changes
            </button>
          </div>

          {/* 3. SIMPLIFIED ADD GOAL: ONLY TEAM & PLAYER NAME */}
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', padding: 16, borderRadius: 14, marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#059669', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Add Goal (Player Name)
            </h3>

            <form onSubmit={handleAddGoalEvent}>
              <div className="admin-add-goal-grid">
                <div>
                  <label className="form-label">Team</label>
                  <select 
                    className="form-select" 
                    value={eventTeamId} 
                    onChange={(e) => setEventTeamId(e.target.value)} 
                    required
                  >
                    {selectedMatch.home_team_id && <option value={selectedMatch.home_team_id}>{selectedMatch.home_team_name}</option>}
                    {selectedMatch.away_team_id && <option value={selectedMatch.away_team_id}>{selectedMatch.away_team_name}</option>}
                  </select>
                </div>

                <div>
                  <label className="form-label">Scoring Player Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter Player Name (e.g. Rahul, Anas)" 
                    value={eventPlayerName} 
                    onChange={(e) => setEventPlayerName(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: 14 }}>
                <Plus size={15} /> Add Goal
              </button>
            </form>
          </div>

          {/* Goal events list */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 10, textTransform: 'uppercase' }}>
              Recorded Goals ({selectedMatch.events ? selectedMatch.events.length : 0})
            </h4>

            {(!selectedMatch.events || selectedMatch.events.length === 0) ? (
              <div style={{ color: '#94a3b8', fontSize: 13, padding: '8px 0' }}>No goals recorded for this match yet.</div>
            ) : (
              selectedMatch.events.map(ev => (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 8 }}>
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: 14 }}>{ev.player_name || ev.player_name_custom}</strong>
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>({ev.team_name})</span>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'none', border: 'none', color: '#dc2626', padding: 4 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
