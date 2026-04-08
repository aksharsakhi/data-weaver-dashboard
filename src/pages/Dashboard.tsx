import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Activity,
  Database,
  CheckCircle,
  Clock,
  XCircle,
  LayoutDashboard,
  RefreshCw,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface Session {
  id: string | number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
}

interface Stats {
  total: number;
  completed: number;
  running: number;
  failed: number;
}

const API_BASE = 'http://localhost:8000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions/list`);
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const stats: Stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    running: sessions.filter(s => s.status === 'running' || s.status === 'pending').length,
    failed: sessions.filter(s => s.status === 'failed').length,
  };

  const recent = [...sessions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const statusStyle = (s: string) => {
    if (s === 'completed') return { badge: 'badge-success', icon: <CheckCircle size={12} /> };
    if (s === 'failed') return { badge: 'badge-error', icon: <XCircle size={12} /> };
    return { badge: 'badge-warning', icon: <Clock size={12} /> };
  };

  return (
    <div className="animate-in">

      {/* ── Title Row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.8rem' }}>
          <LayoutDashboard size={28} color="var(--primary)" />
          Operational Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={fetchData} title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/configure')}>
            <PlusCircle size={18} /> New Extraction
          </button>
        </div>
      </div>

      {/* ── Backend Status Banner ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 18px', borderRadius: '10px', marginBottom: '28px',
        background: backendOnline ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)',
        border: `1px solid ${backendOnline ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'}`,
        fontSize: '0.85rem',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: backendOnline ? 'var(--success)' : 'var(--error)',
          boxShadow: backendOnline ? '0 0 6px var(--success)' : 'none',
          flexShrink: 0,
        }} />
        <span style={{ color: backendOnline ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
          Backend {backendOnline ? 'Online' : 'Offline'}
        </span>
        <span className="text-muted">
          {backendOnline
            ? '— FastAPI running at http://localhost:8000'
            : '— Start the backend to begin extracting data'}
        </span>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Sessions', value: isLoading ? '…' : stats.total, icon: <Database size={20} />, color: 'var(--primary)' },
          { label: 'Completed', value: isLoading ? '…' : stats.completed, icon: <CheckCircle size={20} />, color: 'var(--success)' },
          { label: 'Running', value: isLoading ? '…' : stats.running, icon: <Activity size={20} />, color: 'var(--primary)' },
          { label: 'Failed', value: isLoading ? '…' : stats.failed, icon: <XCircle size={20} />, color: stats.failed > 0 ? 'var(--error)' : 'var(--text-muted)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ margin: 0, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '12px',
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {isLoading ? (
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                ) : stat.value}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Sessions ── */}
      <div className="card" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent Sessions</h3>
          <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => navigate('/history')}>
            View All <ArrowRight size={14} />
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Loader2 size={28} color="var(--primary)" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            Loading sessions…
            <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
          </div>
        ) : !backendOnline ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <XCircle size={32} color="var(--error)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            Backend is offline. Start the server to see session data.
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Database size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            No sessions yet. Create your first extraction session.
            <br />
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/configure')}>
              <PlusCircle size={18} /> Start Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recent.map(s => {
              const { badge, icon } = statusStyle(s.status);
              const progress = s.total_tasks > 0 ? Math.round((s.completed_tasks / s.total_tasks) * 100) : 0;
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px', borderRadius: '12px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.01)',
                  }}
                  onClick={() => s.status === 'completed'
                    ? navigate(`/results/${s.id}`)
                    : navigate(`/status/${s.id}`)
                  }
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(188,63,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.78rem', marginTop: '2px' }}>
                      {s.total_tasks} entities ·{' '}
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div style={{ width: '100px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{
                      width: `${progress}%`, height: '100%',
                      background: s.status === 'failed' ? 'var(--error)' : 'var(--primary)',
                      borderRadius: '3px', transition: 'width 0.5s',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '32px', textAlign: 'right', flexShrink: 0 }}>
                    {progress}%
                  </span>

                  <span className={`badge ${badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {icon} {s.status}
                  </span>

                  <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
