import React, { useState } from 'react';
import { api } from '../services/api';
import { useAutoPolling } from '../hooks/useAutoPolling';
import MatchCard from '../components/MatchCard';
import { GitBranch, Trophy, ArrowRight, Shield } from 'lucide-react';

export default function BracketPage({ onSelectMatch }) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'A', 'B'
  const { data, loading } = useAutoPolling(api.getMatches, 10000);

  const matches = data?.matches || [];

  // Group matches by round
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
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Official Knockout Bracket</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          Real-time progression tracking from Preliminary matches to Grand Final M53
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
          background: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.25) 0%, rgba(15, 28, 63, 0.95) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.6)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div className="badge" style={{ background: '#f59e0b', color: '#000', fontWeight: 900 }}>
              <Trophy size={14} /> GRAND FINAL · MATCH 53
            </div>
            <div style={{ fontSize: 13, color: '#fbbf24', marginTop: 4 }}>
              Pool A Champion (Winner M51) vs Pool B Champion (Winner M52)
            </div>
          </div>
          <MatchCard match={grandFinalMatch} onClick={onSelectMatch} />
        </div>
      )}

      {/* Responsive Round-by-Round Progression */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 6 }}>
              <GitBranch size={16} color="#10b981" />
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>{r.name}</h2>
              <span className="badge" style={{ background: 'var(--bg-surface)', color: '#94a3b8' }}>
                {roundMatches.length} Matches
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
