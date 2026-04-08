import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Eye,
  ServerOff,
} from 'lucide-react';

interface Session {
  id: string | number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
}

const API_BASE = 'http://localhost:8000/api';

const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setBackendDown(false);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/sessions/list`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || `Server returned ${res.status}`);
      }
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setBackendDown(true);
      setErrorMsg(err?.message || 'Could not connect to backend.');
      setSessions([]); // Never show stale or mock data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const statusIcon = (s: string) => {
    if (s === 'completed') return <CheckCircle size={14} color="var(--success)" />;
    if (s === 'failed') return <XCircle size={14} color="var(--error)" />;
    return <Clock size={14} color="var(--primary)" />;
  };

  const statusBadge = (s: string) => {
    if (s === 'completed') return 'badge-success';
    if (s === 'failed') return 'badge-error';
    return 'badge-warning';
  };

  // ── Loading spinner ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <Loader2 size={40} color="var(--primary)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p className="text-muted">Fetching session history…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Backend unreachable ──────────────────────────────────────────────────
  if (backendDown) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <ServerOff size={48} color="var(--error)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: 'var(--error)', marginBottom: '12px' }}>Backend Offline</h3>
        <p className="text-muted" style={{ marginBottom: '8px' }}>{errorMsg}</p>
        <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '32px' }}>
          Start the FastAPI backend on <code>http://localhost:8000</code> and try again.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/configure')}>
            <PlusCircle size={18} /> New Session
          </button>
          <button className="btn btn-primary" onClick={fetchHistory}>
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-in" style={{ width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Extraction History</h2>
          <p className="text-muted" style={{ marginTop: '6px' }}>
            {sessions.length === 0
              ? 'No sessions recorded yet.'
              : `${sessions.length} session${sessions.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={fetchHistory} title="Refresh">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/configure')}>
            <PlusCircle size={18} /> New Session
          </button>
        </div>
      </header>

      {/* ── Empty State ── */}
      {sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <AlertTriangle size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p className="text-muted">No extraction sessions found.</p>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '6px', marginBottom: '32px' }}>
            Start a new session to begin brake test data extraction.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/configure')}>
            <PlusCircle size={18} /> Create First Session
          </button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Session Name</th>
              <th>Entities</th>
              <th>Progress</th>
              <th>Created</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, idx) => {
              const progress = s.total_tasks > 0
                ? Math.round((s.completed_tasks / s.total_tasks) * 100)
                : 0;
              return (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-muted)', width: '48px' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.total_tasks ?? '—'} entities</td>
                  <td style={{ minWidth: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        flex: 1, height: '6px',
                        background: 'var(--border)', borderRadius: '3px', overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progress}%`, height: '100%',
                          background: s.status === 'failed' ? 'var(--error)' : 'var(--primary)',
                          borderRadius: '3px', transition: 'width 0.5s'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {progress}%
                      </span>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {s.created_at
                      ? new Date(s.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td>
                    <span
                      className={`badge ${statusBadge(s.status)}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      {statusIcon(s.status)}
                      {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                        onClick={() => navigate(`/status/${s.id}`)}
                      >
                        <Eye size={14} /> Monitor
                      </button>
                      {s.status === 'completed' && (
                        <button
                          className="btn btn-primary"
                          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                          onClick={() => navigate(`/results/${s.id}`)}
                        >
                          Results
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
