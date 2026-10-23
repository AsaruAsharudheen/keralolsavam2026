import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Award, Plus, Trash2, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

export default function AdminScoreManager({ token }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Form states for selected match
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [homeHT, setHomeHT] = useState('');
  const [awayHT, setAwayHT] = useState('');
  const [homePK, setHomePK] = useState('');
  const [awayPK, setAwayPK] = useState('');
  const [isPenalties, setIsPenalties] = useState(false);
  const [status, setStatus] = useState('Upcoming');

  // Event modal state
  const [eventTeamId, setEventTeamId] = useState('');
  const [eventPlayerName, setEventPlayerName] = useState('');
  const [eventType, setEventType] = useState('GOAL');
  const [eventMinute, setEventMinute] = useState(1);
  const [eventDesc, setEventDesc] = useState('');

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
        setHomeHT(m.home_halftime_score !== null ? m.home_halftime_score : '');
        setAwayHT(m.away_halftime_score !== null ? m.away_halftime_score : '');
        setHomePK(m.home_penalty_score !== null ? m.home_penalty_score : '');
        setAwayPK(m.away_penalty_score !== null ? m.away_penalty_score : '');
        setIsPenalties(m.is_penalties == 1);
        setStatus(m.status);
        if (m.home_team_id) setEventTeamId(m.home_team_id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedMatch) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await api.updateMatchStatus(selectedMatch.id, newStatus, 'Confirmed by Admin', token);
      if (res.success) {
        setMsg({ type: 'success', text: res.message + (res.progression ? ` (Team ${res.progression.winner_team_id} advanced to M${res.progression.next_match_progression?.next_match_number || 'next'})` : '') });
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

  const handleSaveScore = async () => {
    if (!selectedMatch) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await api.updateMatchScore({
        id: selectedMatch.id,
        home_score: parseInt(homeScore) || 0,
        away_score: parseInt(awayScore) || 0,
        home_halftime_score: homeHT !== '' ? parseInt(homeHT) : null,
        away_halftime_score: awayHT !== '' ? parseInt(awayHT) : null,
        home_penalty_score: homePK !== '' ? parseInt(homePK) : null,
        away_penalty_score: awayPK !== '' ? parseInt(awayPK) : null,
        is_penalties: isPenalties ? 1 : 0
      }, token);

      if (res.success) {
        setMsg({ type: 'success', text: 'Score updated successfully' });
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

  const handleAddGoalEvent = async (e) => {
    e.preventDefault();
    if (!selectedMatch || !eventTeamId) return;
    setSaving(true);
    try {
      const res = await api.addMatchEvent({
        match_id: selectedMatch.id,
        team_id: eventTeamId,
        player_name_custom: eventPlayerName,
        event_type: eventType,
        minute: parseInt(eventMinute) || 1,
        description: eventDesc
      }, token);

      if (res.success) {
        setEventPlayerName('');
        setEventDesc('');
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
    if (!confirm('Are you sure you want to remove this match event?')) return;
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
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Live Score & Progression Manager</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          Select any fixture M1 through M53 to update live match status, record goals, and advance winners.
        </p>
      </div>

      {msg && (
        <div style={{ 
          background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${msg.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: msg.type === 'success' ? '#34d399' : '#fca5a5',
          padding: '10px 14px',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 13
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
          style={{ fontSize: 14, fontWeight: 700 }}
        >
          <option value="">-- Choose Match (M1 to M53) --</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              M{m.match_number}: {m.home_team_name || (m.home_source_type === 'WINNER' ? `Winner M${m.home_source_val}` : 'TBD')} vs {m.away_team_name || (m.away_source_type === 'WINNER' ? `Winner of M${m.away_source_val}` : 'TBD')} ({m.status})
            </option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 18, marginTop: 16 }}>
          {/* Header of selected match */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
            <div>
              <span className="badge" style={{ background: '#1e293b', color: '#38bdf8', marginRight: 6 }}>
                M{selectedMatch.match_number}
              </span>
              <strong style={{ fontSize: 16, color: '#fff' }}>
                {selectedMatch.home_team_name || 'TBD'} vs {selectedMatch.away_team_name || 'TBD'}
              </strong>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                Round: {selectedMatch.round_name} · Pool: {selectedMatch.pool_code || 'N/A'} · Next: M{selectedMatch.next_match_number || 'Grand Final Winner'}
              </div>
            </div>

            <span className={`badge badge-${selectedMatch.status.toLowerCase().replace('-', '')}`}>
              {selectedMatch.status}
            </span>
          </div>

          {/* Status Quick Action Buttons */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Update Match Status</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button 
                onClick={() => handleUpdateStatus('Upcoming')} 
                className={`btn btn-outline ${selectedMatch.status === 'Upcoming' ? 'btn-primary' : ''}`}
                style={{ padding: '8px 12px', fontSize: 12 }}
              >
                Upcoming
              </button>
              <button 
                onClick={() => handleUpdateStatus('Live')} 
                className={`btn btn-outline ${selectedMatch.status === 'Live' ? 'btn-danger' : ''}`}
                style={{ padding: '8px 12px', fontSize: 12 }}
              >
                Set LIVE
              </button>
              <button 
                onClick={() => handleUpdateStatus('Half-time')} 
                className="btn btn-outline"
                style={{ padding: '8px 12px', fontSize: 12, color: '#fbbf24', borderColor: '#f59e0b' }}
              >
                Half-Time (HT)
              </button>
              <button 
                onClick={() => handleUpdateStatus('Full-time')} 
                className="btn btn-primary"
                style={{ padding: '8px 14px', fontSize: 12 }}
              >
                Confirm Full-Time & Advance Winner ➔
              </button>
            </div>
          </div>

          {/* Score Counter / Direct Edit */}
          <div style={{ background: 'var(--bg-card)', padding: 14, borderRadius: 12, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'center' }}>
              <div>
                <label className="form-label">{selectedMatch.home_team_name || 'Home Team'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setHomeScore(Math.max(0, parseInt(homeScore || 0) - 1))} className="btn btn-outline" style={{ padding: '6px 12px' }}>-</button>
                  <input type="number" min="0" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} className="form-input" style={{ textAlign: 'center', fontSize: 20, fontWeight: 900 }} />
                  <button onClick={() => setHomeScore(parseInt(homeScore || 0) + 1)} className="btn btn-outline" style={{ padding: '6px 12px' }}>+</button>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontWeight: 900, color: '#64748b', fontSize: 18, marginTop: 16 }}>
                VS
              </div>

              <div>
                <label className="form-label" style={{ textAlign: 'right' }}>{selectedMatch.away_team_name || 'Away Team'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setAwayScore(Math.max(0, parseInt(awayScore || 0) - 1))} className="btn btn-outline" style={{ padding: '6px 12px' }}>-</button>
                  <input type="number" min="0" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} className="form-input" style={{ textAlign: 'center', fontSize: 20, fontWeight: 900 }} />
                  <button onClick={() => setAwayScore(parseInt(awayScore || 0) + 1)} className="btn btn-outline" style={{ padding: '6px 12px' }}>+</button>
                </div>
              </div>
            </div>

            {/* Extra Time / Penalties Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <label className="form-label">Half-Time Scores (HT)</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" placeholder="Home HT" value={homeHT} onChange={(e) => setHomeHT(e.target.value)} className="form-input" style={{ padding: '6px' }} />
                  <input type="number" placeholder="Away HT" value={awayHT} onChange={(e) => setAwayHT(e.target.value)} className="form-input" style={{ padding: '6px' }} />
                </div>
              </div>

              <div>
                <label className="form-label">Penalty Shootout (PK)</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" placeholder="Home PK" value={homePK} onChange={(e) => { setHomePK(e.target.value); setIsPenalties(true); }} className="form-input" style={{ padding: '6px' }} />
                  <input type="number" placeholder="Away PK" value={awayPK} onChange={(e) => { setAwayPK(e.target.value); setIsPenalties(true); }} className="form-input" style={{ padding: '6px' }} />
                </div>
              </div>
            </div>

            <button onClick={handleSaveScore} disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: 14 }}>
              Save Score Changes
            </button>
          </div>

          {/* Add Goal Event Form */}
          <div style={{ background: 'var(--bg-card)', padding: 14, borderRadius: 12, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#34d399', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Record Match Goal Event
            </h3>

            <form onSubmit={handleAddGoalEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label className="form-label">Scoring Team</label>
                  <select className="form-select" value={eventTeamId} onChange={(e) => setEventTeamId(e.target.value)} required>
                    {selectedMatch.home_team_id && <option value={selectedMatch.home_team_id}>{selectedMatch.home_team_name}</option>}
                    {selectedMatch.away_team_id && <option value={selectedMatch.away_team_id}>{selectedMatch.away_team_name}</option>}
                  </select>
                </div>

                <div>
                  <label className="form-label">Scorer Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Rahul, Anas" value={eventPlayerName} onChange={(e) => setEventPlayerName(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="form-label">Minute</label>
                  <input type="number" min="1" max="130" className="form-input" value={eventMinute} onChange={(e) => setEventMinute(e.target.value)} required />
                </div>

                <div>
                  <label className="form-label">Event Type</label>
                  <select className="form-select" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="GOAL">Regular Goal</option>
                    <option value="PENALTY_GOAL">Penalty Goal</option>
                    <option value="OWN_GOAL">Own Goal</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Details / Note</label>
                  <input type="text" className="form-input" placeholder="Header, free kick, etc." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={14} /> Add Goal Event (Auto Updates Score & Scorers)
              </button>
            </form>
          </div>

          {/* Goal events list */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' }}>
              Recorded Match Events ({selectedMatch.events ? selectedMatch.events.length : 0})
            </h4>

            {(!selectedMatch.events || selectedMatch.events.length === 0) ? (
              <div style={{ color: '#64748b', fontSize: 12, padding: '8px 0' }}>No events recorded for this match yet.</div>
            ) : (
              selectedMatch.events.map(ev => (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 900, color: '#10b981', marginRight: 8 }}>{ev.minute}'</span>
                    <strong style={{ color: '#fff' }}>{ev.player_name || ev.player_name_custom}</strong>
                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>({ev.team_name} · {ev.event_type})</span>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: 4 }}>
                    <Trash2 size={14} />
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
