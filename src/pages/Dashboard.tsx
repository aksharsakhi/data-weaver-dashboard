import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Welcome to Data Weaver</h2>
        <button className="btn btn-primary" onClick={() => navigate('/configure')}>
          Start New Session
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Select "Start New Session" to begin extracting data from your folders.
      </p>

      {/* Placeholder for actual past sessions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)'}}>
             <h4 style={{ color: 'var(--text-muted)' }}>No recent sessions found</h4>
             <p style={{ fontSize: '0.875rem' }}>Start your first extraction session to see results here.</p>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
