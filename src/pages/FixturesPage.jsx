import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { Filter, Search, Calendar } from 'lucide-react';

export default function FixturesPage({ onSelectMatch, initialFilter = {} }) {
  const [selectedPool, setSelectedPool] = useState(initialFilter.pool || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(initialFilter.status || 'ALL');
  const [selectedRound, setSelectedRound] = useState(initialFilter.round || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, refetch } = useAutoPolling(() => {
    const filters = {};
    if (selectedPool !== 'ALL') filters.pool = selectedPool;
    if (selectedStatus !== 'ALL') filters.status = selectedStatus;
    if (selectedRound !== 'ALL') filters.round = selectedRound;
    return api.getMatches(filters);
  }, 10000, [selectedPool, selectedStatus, selectedRound]);

  const matches = data?.matches || [];
  const filteredMatches = matches.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.home_team_name && m.home_team_name.toLowerCase().includes(q)) ||
      (m.away_team_name && m.away_team_name.toLowerCase().includes(q)) ||
      `m${m.match_number}`.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      <div style={{ margin: '16px 0 12px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Official Match Fixtures</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          Numbered M1 through M53 · Single Elimination Bracket
        </p>
      </div>

      {/* Pool Selector Tabs */}
      <div className="tabs-nav">
        <button className={`tab-btn ${selectedPool === 'ALL' ? 'active' : ''}`} onClick={() => setSelectedPool('ALL')}>
          All Pools
        </button>
        <button className={`tab-btn ${selectedPool === 'A' ? 'active' : ''}`} onClick={() => setSelectedPool('A')}>
          Pool A (M1-M51)
        </button>
        <button className={`tab-btn ${selectedPool === 'B' ? 'active pool-b' : ''}`} onClick={() => setSelectedPool('B')}>
          Pool B (M2-M52)
        </button>
      </div>

      {/* Filter and Search Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <select 
          className="form-select" 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ fontSize: 13, padding: '8px 10px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Live">Live / HT</option>
          <option value="Full-time">Completed (FT)</option>
        </select>

        <select 
          className="form-select" 
          value={selectedRound} 
          onChange={(e) => setSelectedRound(e.target.value)}
          style={{ fontSize: 13, padding: '8px 10px' }}
        >
          <option value="ALL">All Rounds</option>
          <option value="Round 1 · Preliminary">Round 1 (Preliminary)</option>
          <option value="Round 2">Round 2</option>
          <option value="Round of 16">Round of 16</option>
          <option value="Quarter-Finals">Quarter-Finals</option>
          <option value="Semi-Finals">Semi-Finals</option>
          <option value="Grand Final">Grand Final</option>
        </select>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search team or match (e.g. M1, M51, Moscow, Gally Boys)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: 36, fontSize: 14 }}
        />
        <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
      </div>

      {/* Match Cards List */}
      <div>
        {loading && matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading fixtures...</div>
        ) : filteredMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 12, color: '#94a3b8' }}>
            No matches found matching current filters.
          </div>
        ) : (
          filteredMatches.map(m => (
            <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
          ))
        )}
      </div>
    </div>
  );
}
