import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Activity, LayoutDashboard, Database } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LayoutDashboard size={28} color="var(--primary)" /> Operational Dashboard
        </h2>
        <button className="btn btn-primary" onClick={() => navigate('/configure')}>
          <PlusCircle size={20} /> Create Extraction Session
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
        Monitor automated document extraction workflows and enterprise AI inference sessions.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ background: 'rgba(255,255,255,0.02)', margin: 0, padding: '24px' }}>
             <h4 style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Activity size={18} /> Current Session Status
             </h4>
             <p className="text-muted">No active extraction jobs detected.</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,0.02)', margin: 0, padding: '24px' }}>
             <h4 style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Database size={18} /> Data Pipeline Summary
             </h4>
             <p className="text-muted">Initiate your first session to populate historical metrics.</p>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
