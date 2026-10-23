// API base URL configuration:
// Automatically detects production (Vercel) to connect to live Hostinger backend on brandfolks.in
// In local dev, falls back to Vite proxy /api (or local PHP server)
const API_BASE = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://brandfolks.in/KeralolBackend/api'
  : '/api';

export const api = {
  // Stats & Overview
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/stats.php?action=dashboard_stats`);
    return res.json();
  },

  getTopScorers: async () => {
    const res = await fetch(`${API_BASE}/stats.php?action=scorers`);
    return res.json();
  },

  getPoolsOverview: async () => {
    const res = await fetch(`${API_BASE}/stats.php?action=pools_overview`);
    return res.json();
  },

  getSettings: async () => {
    const res = await fetch(`${API_BASE}/stats.php?action=get_settings`);
    return res.json();
  },

  updateSettings: async (settings, token) => {
    const res = await fetch(`${API_BASE}/stats.php?action=update_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Teams
  getTeams: async (pool = null, search = '') => {
    let url = `${API_BASE}/teams.php?action=list`;
    if (pool) url += `&pool=${pool}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return res.json();
  },

  getTeam: async (id) => {
    const res = await fetch(`${API_BASE}/teams.php?action=get&id=${id}`);
    return res.json();
  },

  updateTeam: async (teamData, token) => {
    const res = await fetch(`${API_BASE}/teams.php?action=update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(teamData)
    });
    return res.json();
  },

  // Matches & Fixtures
  getMatches: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.pool) params.append('pool', filters.pool);
    if (filters.status) params.append('status', filters.status);
    if (filters.round) params.append('round', filters.round);
    const res = await fetch(`${API_BASE}/fixtures.php?action=list&${params.toString()}`);
    return res.json();
  },

  getMatch: async (idOrNumber, isMatchNum = false) => {
    const param = isMatchNum ? `match_number=${idOrNumber}` : `id=${idOrNumber}`;
    const res = await fetch(`${API_BASE}/fixtures.php?action=get&${param}`);
    return res.json();
  },

  updateMatchStatus: async (matchId, status, summary = null, token) => {
    const res = await fetch(`${API_BASE}/fixtures.php?action=update_status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: matchId, status, summary })
    });
    return res.json();
  },

  updateMatchScore: async (scoreData, token) => {
    const res = await fetch(`${API_BASE}/fixtures.php?action=update_score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scoreData)
    });
    return res.json();
  },

  updateMatchMeta: async (metaData, token) => {
    const res = await fetch(`${API_BASE}/fixtures.php?action=update_meta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(metaData)
    });
    return res.json();
  },

  addMatchEvent: async (eventData, token) => {
    const res = await fetch(`${API_BASE}/fixtures.php?action=add_event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });
    return res.json();
  },

  deleteMatchEvent: async (eventId, token) => {
    const res = await fetch(`${API_BASE}/fixtures.php?action=delete_event&event_id=${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },

  resyncProgression: async (token) => {
    const res = await fetch(`${API_BASE}/fixtures.php?action=resync_progression`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },

  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth.php?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  checkMe: async (token) => {
    const res = await fetch(`${API_BASE}/auth.php?action=me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  logout: async (token) => {
    const res = await fetch(`${API_BASE}/auth.php?action=logout`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  changePassword: async (old_password, new_password, token) => {
    const res = await fetch(`${API_BASE}/auth.php?action=change_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ old_password, new_password })
    });
    return res.json();
  },

  // Fixture Import & Preview
  getImportPreview: async () => {
    const res = await fetch(`${API_BASE}/fixture_import.php?action=preview_default`);
    return res.json();
  },

  applyImportData: async (payload, token) => {
    const res = await fetch(`${API_BASE}/fixture_import.php?action=apply_import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
