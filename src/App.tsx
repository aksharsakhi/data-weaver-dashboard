import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History as HistoryIcon, 
  BookOpen, 
  Settings as SettingsIcon,
  Database
} from 'lucide-react';

import ConfigureSession from './pages/ConfigureSession';
import SessionStatus from './pages/SessionStatus';
import Dashboard from './pages/Dashboard';
import Instructions from './pages/Instructions';
import Settings from './pages/Settings';
import History from './pages/History';
import Results from './pages/Results';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Database size={24} strokeWidth={2.5} />
        <span>Data Weaver</span>
      </div>
      
      <nav className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/configure" className={`nav-item ${isActive('/configure') ? 'active' : ''}`}>
          <PlusCircle size={20} /> New Extraction
        </Link>
        <Link to="/history" className={`nav-item ${isActive('/history') ? 'active' : ''}`}>
          <HistoryIcon size={20} /> History
        </Link>
        <Link to="/instructions" className={`nav-item ${isActive('/instructions') ? 'active' : ''}`}>
          <BookOpen size={20} /> User Guide
        </Link>
        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <SettingsIcon size={20} /> Settings
        </Link>
      </nav>

      <div className="theme-toggle" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
         <span className="text-muted" style={{ fontSize: '0.8rem' }}>V1.2.0 • Data Weaver</span>
      </div>
    </div>
  );
};

const App = () => {
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
                        <Route path="/history" element={<History />} />
                        <Route path="/results/:id" element={<Results />} />
                        <Route path="/instructions" element={<Instructions />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
