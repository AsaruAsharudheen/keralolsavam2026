import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Edit2, Check, X } from 'lucide-react';

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
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Teams & Byes Management</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Search and edit team names, pool allocations (Pool A & Pool B), and seeded bye assignments.
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

      {/* Edit Form */}
      {editingTeam && (
        <div style={{ background: '#ffffff', border: '2px solid var(--accent-green)', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
              Edit Team #{editingTeam.seed_number}
            </h3>
            <button onClick={() => setEditingTeam(null)} style={{ background: 'none', border: 'none', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveTeam}>
            <div className="admin-team-edit-row1">
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

            <div className="admin-team-edit-row2">
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
              <button type="submit" className="btn btn-primary" style={{ padding: '9px 20px', flex: 1 }}>
                <Check size={16} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditingTeam(null)} className="btn btn-outline" style={{ padding: '9px 20px' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="admin-team-filters" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search teams by name or seed..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 13 }} />
        </div>

        <select 
          className="form-select admin-pool-filter-select" 
          value={poolFilter} 
          onChange={(e) => setPoolFilter(e.target.value)}
        >
          <option value="ALL">All Pools</option>
          <option value="A">Pool A (27)</option>
          <option value="B">Pool B (27)</option>
        </select>
      </div>

      {/* Teams list */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        {filtered.map((t, idx) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 34, fontWeight: 900, color: '#64748b', fontSize: 13 }}>#{t.seed_number}</span>
              <div>
                <strong style={{ color: '#0f172a', fontSize: 15 }}>{t.name}</strong>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                  <span className={`badge badge-pool-${t.pool_code.toLowerCase()}`} style={{ marginRight: 8 }}>
                    Pool {t.pool_code}
                  </span>
                  {t.is_bye == 1 && <span className="badge badge-bye">Bye (Enters M{t.bye_target_match})</span>}
                  {t.contact_person && <span style={{ marginLeft: 8 }}>Contact: {t.contact_person}</span>}
                </div>
              </div>
            </div>

            <button onClick={() => setEditingTeam(t)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: 12 }}>
              <Edit2 size={13} /> Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
