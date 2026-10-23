import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Search, Edit2, Check, X, Shield, Plus } from 'lucide-react';

export default function AdminTeamsManager({ token }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [poolFilter, setPoolFilter] = useState('ALL');
  const [editingTeam, setEditingTeam] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await api.getTeams();
      if (res.success) {
        setTeams(res.teams);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    try {
      const res = await api.updateTeam(editingTeam, token);
      if (res.success) {
        setMsg({ type: 'success', text: `Team #${editingTeam.seed_number} updated successfully` });
        setEditingTeam(null);
        loadTeams();
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const filtered = teams.filter(t => {
    if (poolFilter !== 'ALL' && t.pool_code !== poolFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || String(t.seed_number).includes(q);
  });

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Teams Management</h1>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          View, search and edit all 54 teams extracted from the official fixture document.
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

      {/* Edit Modal / Panel */}
      {editingTeam && (
        <div style={{ background: 'var(--bg-surface)', border: '2px solid var(--accent-green)', borderRadius: 14, padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              Edit Team #{editingTeam.seed_number}
            </h3>
            <button onClick={() => setEditingTeam(null)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveTeam}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Team Official Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingTeam.name} 
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assigned Pool</label>
                <select 
                  className="form-select" 
                  value={editingTeam.pool_id} 
                  onChange={(e) => setEditingTeam({ ...editingTeam, pool_id: parseInt(e.target.value) })}
                >
                  <option value={1}>Pool A</option>
                  <option value={2}>Pool B</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Is Seeded Bye?</label>
                <select 
                  className="form-select" 
                  value={editingTeam.is_bye} 
                  onChange={(e) => setEditingTeam({ ...editingTeam, is_bye: parseInt(e.target.value) })}
                >
                  <option value={0}>No (Round 1)</option>
                  <option value={1}>Yes (Bye to R2)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contact Person</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingTeam.contact_person || ''} 
                  onChange={(e) => setEditingTeam({ ...editingTeam, contact_person: e.target.value })} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingTeam.phone || ''} 
                  onChange={(e) => setEditingTeam({ ...editingTeam, phone: e.target.value })} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px' }}>
                <Check size={16} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditingTeam(null)} className="btn btn-outline" style={{ padding: '8px 18px' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search 54 teams by name or seed..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: 12 }} />
        </div>

        <select 
          className="form-select" 
          value={poolFilter} 
          onChange={(e) => setPoolFilter(e.target.value)}
          style={{ width: 130 }}
        >
          <option value="ALL">All Pools</option>
          <option value="A">Pool A (27)</option>
          <option value="B">Pool B (27)</option>
        </select>
      </div>

      {/* Teams list */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 14, overflow: 'hidden' }}>
        {filtered.map((t, idx) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, fontWeight: 900, color: '#64748b', fontSize: 13 }}>#{t.seed_number}</span>
              <div>
                <strong style={{ color: '#fff', fontSize: 14 }}>{t.name}</strong>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  <span className={`badge badge-pool-${t.pool_code.toLowerCase()}`} style={{ marginRight: 6 }}>
                    Pool {t.pool_code}
                  </span>
                  {t.is_bye == 1 && <span className="badge badge-bye">Bye (M{t.bye_target_match})</span>}
                  {t.contact_person && <span style={{ marginLeft: 8 }}>Contact: {t.contact_person}</span>}
                </div>
              </div>
            </div>

            <button onClick={() => setEditingTeam(t)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}>
              <Edit2 size={13} /> Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
