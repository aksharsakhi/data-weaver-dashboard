import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ConfigureSession from './pages/ConfigureSession';
import SessionStatus from './pages/SessionStatus';
import Dashboard from './pages/Dashboard';
import Instructions from './pages/Instructions';
import Settings from './pages/Settings';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: '2rem' }}>🦅</span>
        <span>Data Weaver</span>
      </div>
      
      <nav className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <span>🏠</span> Dashboard
        </Link>
        <Link to="/configure" className={`nav-item ${isActive('/configure') ? 'active' : ''}`}>
          <span>🚀</span> Start Session
        </Link>
        <Link to="/instructions" className={`nav-item ${isActive('/instructions') ? 'active' : ''}`}>
          <span>📖</span> Instructions
        </Link>
        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <span>⚙️</span> Settings
        </Link>
      </nav>

      <div className="theme-toggle">
         <span className="text-muted" style={{ fontSize: '0.8rem' }}>V1.0.4 Enterprise</span>
      </div>
    </div>
  );
};

const App = () => {
    // Inject theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/configure" element={<ConfigureSession />} />
                        <Route path="/status/:id" element={<SessionStatus />} />
                        <Route path="/instructions" element={<Instructions />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
