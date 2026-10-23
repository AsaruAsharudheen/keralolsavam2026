import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { GitBranch, Trophy } from 'lucide-react';

export default function BracketPage({ onSelectMatch }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const { data } = useAutoPolling(api.getMatches, 10000);

  const matches = data?.matches || [];

  const rounds = [
    { key: 'R1', name: 'Round 1 · Preliminary', matches: matches.filter(m => m.round_name === 'Round 1 · Preliminary') },
    { key: 'R2', name: 'Round 2', matches: matches.filter(m => m.round_name === 'Round 2') },
    { key: 'R16', name: 'Round of 16', matches: matches.filter(m => m.round_name === 'Round of 16') },
    { key: 'QF', name: 'Quarter-Finals', matches: matches.filter(m => m.round_name === 'Quarter-Finals') },
    { key: 'SF', name: 'Semi-Finals', matches: matches.filter(m => m.round_name === 'Semi-Finals') },
    { key: 'GF', name: 'Grand Final', matches: matches.filter(m => m.round_name === 'Grand Final') },
  ];

  const grandFinalMatch = matches.find(m => m.match_number == 53);

  return (
    <div className="container">
      <div style={{ margin: '16px 0 12px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Knockout Tournament Bracket</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Round-by-round progression tree from Preliminary fixtures through Grand Final M53
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
          Full Bracket
        </button>
        <button className={`tab-btn ${activeTab === 'A' ? 'active' : ''}`} onClick={() => setActiveTab('A')}>
          Pool A Tree
        </button>
        <button className={`tab-btn ${activeTab === 'B' ? 'active pool-b' : ''}`} onClick={() => setActiveTab('B')}>
          Pool B Tree
        </button>
      </div>

      {/* Grand Final Pinnacle Card */}
      {grandFinalMatch && (
        <div style={{ 
          background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
          border: '2px solid #f59e0b',
          borderRadius: 18,
          padding: 18,
          marginBottom: 24,
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 900 }}>
              <Trophy size={14} /> GRAND FINAL · MATCH 53
            </div>
            <div style={{ fontSize: 13, color: '#b45309', marginTop: 4, fontWeight: 700 }}>
              Pool A Champion (Winner M51) vs Pool B Champion (Winner M52)
            </div>
          </div>
          <MatchCard match={grandFinalMatch} onClick={onSelectMatch} />
        </div>
      )}

      {/* Round by Round */}
      {rounds.map(r => {
        let roundMatches = r.matches;
        if (activeTab === 'A') {
          roundMatches = roundMatches.filter(m => m.pool_code === 'A' || m.match_number == 53);
        } else if (activeTab === 'B') {
          roundMatches = roundMatches.filter(m => m.pool_code === 'B' || m.match_number == 53);
        }

        if (roundMatches.length === 0) return null;

        return (
          <div key={r.key} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: '2px solid #e2e8f0', paddingBottom: 6 }}>
              <GitBranch size={17} color="#059669" />
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{r.name}</h2>
              <span className="badge badge-pending">
                {roundMatches.length} Fixtures
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {roundMatches.map(m => (
                <MatchCard key={m.id} match={m} onClick={onSelectMatch} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
