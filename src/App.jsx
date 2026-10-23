import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  GitBranch, 
  Award, 
  Shield, 
  Settings, 
  Lock, 
  LogOut, 
  Eye,
  Trophy
} from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import FixturesPage from './pages/FixturesPage';
import PoolsPage from './pages/PoolsPage';
import BracketPage from './pages/BracketPage';
import ScorersPage from './pages/ScorersPage';
import MatchDetailPage from './pages/MatchDetailPage';
import ComingSoon from './pages/ComingSoon';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminScoreManager from './admin/AdminScoreManager';
import AdminTeamsManager from './admin/AdminTeamsManager';
import AdminFixtureImport from './admin/AdminFixtureImport';

export default function App() {
  // Inauguration Mode: When true, shows exclusively the coming soon inauguration showcase
  // Admin can toggle this anytime in Admin Dashboard or view the tournament preview
  const [isInaugurationMode, setIsInaugurationMode] = useState(() => {
    const saved = localStorage.getItem('inauguration_mode');
    return saved !== null ? saved === 'true' : true; // Default: true for inauguration mode
  });

  const [currentPage, setCurrentPage] = useState('home'); 
  const [currentPoolTab, setCurrentPoolTab] = useState('A');
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [selectedMatchNumber, setSelectedMatchNumber] = useState(null);
  const [fixturesFilter, setFixturesFilter] = useState({});

  // Admin Auth State
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || null);
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('admin_user') || 'null'));
  const [adminSubPage, setAdminSubPage] = useState('dashboard');

  useEffect(() => {
    if (isInaugurationMode && !currentPage.startsWith('admin')) {
      document.body.classList.add('inauguration-mode');
    } else {
      document.body.classList.remove('inauguration-mode');
    }
  }, [isInaugurationMode, currentPage]);

  const toggleInaugurationMode = (enabled) => {
    setIsInaugurationMode(enabled);
    localStorage.setItem('inauguration_mode', enabled ? 'true' : 'false');
  };

  const handleLoginSuccess = (token, admin) => {
    setAdminToken(token);
    setAdminUser(admin);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setCurrentPage('home');
  };

  const handleSelectMatch = (match) => {
    setSelectedMatchId(match.id);
    setSelectedMatchNumber(match.match_number);
    setCurrentPage('match-detail');
  };

  const handleNavigate = (page, param = null) => {
    if (page === 'pools' && typeof param === 'string') {
      setCurrentPoolTab(param);
    } else if (page === 'fixtures' && param) {
      setFixturesFilter(param);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. INAUGURATION MODE (PUBLIC VIEW):
  // Show ONLY coming soon inauguration poster, Keralolsavam 2026 loading bar, and hide all other public pages.
  if (isInaugurationMode && !currentPage.startsWith('admin')) {
    return (
      <ComingSoon onAdminClick={() => setCurrentPage('admin')} />
    );
  }

  // 2. LIVE TOURNAMENT & ADMIN MODE:
  return (
    <div>
      {/* Top Header */}
      <header className="app-header">
        <div className="container header-content">
          <div className="brand-wrapper" onClick={() => handleNavigate('home')} style={{ cursor: 'pointer' }}>
            <div className="brand-emblem">
              <Trophy size={22} />
            </div>
            <div>
              <div className="brand-title">KERALOLSAVAM 2026</div>
              <div className="brand-subtitle">NELLAYA GRAMAPANCHAYAT FOOTBALL</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="#home" className={currentPage === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>Home</a>
            <a href="#fixtures" className={currentPage === 'fixtures' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavigate('fixtures'); }}>Fixtures</a>
            <a href="#pools" className={currentPage === 'pools' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavigate('pools'); }}>Pools</a>
            <a href="#bracket" className={currentPage === 'bracket' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavigate('bracket'); }}>Bracket</a>
            <a href="#scorers" className={currentPage === 'scorers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); handleNavigate('scorers'); }}>Scorers</a>
          </nav>

          {/* Admin Pill / Action */}
          <div className="header-actions">
            {currentPage.startsWith('admin') ? (
              adminToken ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    onClick={() => toggleInaugurationMode(!isInaugurationMode)} 
                    className="admin-pill-btn"
                    style={{ color: isInaugurationMode ? '#fbbf24' : '#10b981', borderColor: isInaugurationMode ? '#f59e0b' : '#10b981' }}
                  >
                    {isInaugurationMode ? '● Inauguration Mode (Active)' : '○ Public Tournament Live'}
                  </button>
                  <button onClick={() => setCurrentPage('home')} className="admin-pill-btn">
                    Public View
                  </button>
                  <button onClick={handleLogout} className="admin-pill-btn" style={{ color: '#ef4444' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => setCurrentPage('home')} className="admin-pill-btn">
                  Public View
                </button>
              )
            ) : (
              <button onClick={() => setCurrentPage('admin')} className="admin-pill-btn">
                <Lock size={13} color="#10b981" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '16px 0 32px' }}>
        {currentPage === 'home' && (
          <HomePage onSelectMatch={handleSelectMatch} onNavigate={handleNavigate} />
        )}

        {currentPage === 'fixtures' && (
          <FixturesPage onSelectMatch={handleSelectMatch} initialFilter={fixturesFilter} />
        )}

        {currentPage === 'pools' && (
          <PoolsPage defaultPool={currentPoolTab} onSelectMatch={handleSelectMatch} />
        )}

        {currentPage === 'bracket' && (
          <BracketPage onSelectMatch={handleSelectMatch} />
        )}

        {currentPage === 'scorers' && (
          <ScorersPage />
        )}

        {currentPage === 'match-detail' && (
          <MatchDetailPage 
            matchId={selectedMatchId} 
            matchNumber={selectedMatchNumber} 
            onBack={() => setCurrentPage('fixtures')} 
          />
        )}

        {currentPage === 'admin' && (
          adminToken ? (
            <div className="container">
              {/* Inauguration Mode Quick Toggle Banner in Admin */}
              <div style={{ 
                background: isInaugurationMode ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)', 
                border: `1px solid ${isInaugurationMode ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                borderRadius: 12, 
                padding: '12px 16px', 
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10
              }}>
                <div>
                  <strong style={{ color: isInaugurationMode ? '#fbbf24' : '#34d399', fontSize: 14 }}>
                    {isInaugurationMode ? '★ INAUGURATION MODE IS CURRENTLY ACTIVE' : '✓ PUBLIC TOURNAMENT WEBSITE IS CURRENTLY LIVE'}
                  </strong>
                  <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>
                    {isInaugurationMode 
                      ? 'Visitors see the inauguration poster with Keralolsavam 2026 loading bar. All fixtures & pools are hidden from public.'
                      : 'All public visitors can see full live fixtures, pool A & B rosters, scores, and knockout bracket.'}
                  </div>
                </div>

                <button 
                  onClick={() => toggleInaugurationMode(!isInaugurationMode)}
                  className="btn"
                  style={{ 
                    background: isInaugurationMode ? '#10b981' : '#f59e0b', 
                    color: '#070d1e', 
                    padding: '8px 16px', 
                    fontSize: 13,
                    fontWeight: 800 
                  }}
                >
                  {isInaugurationMode ? 'Publish Tournament Live ➔' : 'Revert to Inauguration Poster ➔'}
                </button>
              </div>

              {/* Admin Internal Nav Tabs */}
              <div className="tabs-nav" style={{ marginBottom: 20 }}>
                <button className={`tab-btn ${adminSubPage === 'dashboard' ? 'active' : ''}`} onClick={() => setAdminSubPage('dashboard')}>
                  Dashboard
                </button>
                <button className={`tab-btn ${adminSubPage === 'scores' ? 'active' : ''}`} onClick={() => setAdminSubPage('scores')}>
                  Scores & Live
                </button>
                <button className={`tab-btn ${adminSubPage === 'teams' ? 'active' : ''}`} onClick={() => setAdminSubPage('teams')}>
                  Teams (54)
                </button>
                <button className={`tab-btn ${adminSubPage === 'import' ? 'active' : ''}`} onClick={() => setAdminSubPage('import')}>
                  PDF Fixture Import
                </button>
              </div>

              {adminSubPage === 'dashboard' && <AdminDashboard token={adminToken} onNavigateSub={setAdminSubPage} />}
              {adminSubPage === 'scores' && <AdminScoreManager token={adminToken} />}
              {adminSubPage === 'teams' && <AdminTeamsManager token={adminToken} />}
              {adminSubPage === 'import' && <AdminFixtureImport token={adminToken} />}
            </div>
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          )
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button className={`nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => handleNavigate('home')}>
          <Home size={20} />
          <span>Home</span>
        </button>

        <button className={`nav-item ${currentPage === 'fixtures' ? 'active' : ''}`} onClick={() => handleNavigate('fixtures')}>
          <Calendar size={20} />
          <span>Fixtures</span>
        </button>

        <button className={`nav-item ${currentPage === 'pools' ? 'active' : ''}`} onClick={() => handleNavigate('pools')}>
          <Shield size={20} />
          <span>Pools</span>
        </button>

        <button className={`nav-item ${currentPage === 'bracket' ? 'active' : ''}`} onClick={() => handleNavigate('bracket')}>
          <GitBranch size={20} />
          <span>Bracket</span>
        </button>

        <button className={`nav-item ${currentPage === 'scorers' ? 'active' : ''}`} onClick={() => handleNavigate('scorers')}>
          <Award size={20} />
          <span>Scorers</span>
        </button>
      </nav>
    </div>
  );
}
