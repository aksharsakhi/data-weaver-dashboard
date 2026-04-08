import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Folder,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Clock,
  RefreshCw,
  XCircle,
  Loader2,
} from 'lucide-react';

interface SessionData {
  id: string | number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_tasks: number;
  completed_tasks: number;
  failed_tasks?: number;
  logs?: string[];
  created_at?: string;
}

interface TaskItem {
  folder_name: string;
  status: 'success' | 'failed' | 'pending';
  error?: string;
}

type FetchState = 'loading' | 'error' | 'success';

const API_BASE = 'http://localhost:8000/api';

const SessionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionData | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [backendError, setBackendError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      // Fetch session status
      const statusRes = await fetch(`${API_BASE}/sessions/${id}/status`);
      if (!statusRes.ok) {
        const errBody = await statusRes.json().catch(() => ({}));
        throw new Error(errBody?.detail || `Status ${statusRes.status}`);
      }
      const sessionData: SessionData = await statusRes.json();
      setSession(sessionData);

      // Fetch task list
      const tasksRes = await fetch(`${API_BASE}/sessions/${id}/results`);
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      }

      setFetchState('success');
      setBackendError(null);
      setLastRefresh(new Date());
    } catch (err: any) {
      setFetchState('error');
      setBackendError(err?.message || 'Could not reach backend server.');
    }
  }, [id]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // ── Guard: no session ID ──────────────────────────────────────────────────
  if (!id) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <XCircle size={48} color="var(--error)" style={{ margin: '0 auto 16px' }} />
        <h3>Invalid Session</h3>
        <p className="text-muted" style={{ margin: '12px 0 32px' }}>
          No session ID was provided in the URL.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/history')}>
          Back to History
        </button>
      </div>
    );
  }

  // ── Guard: backend unreachable ────────────────────────────────────────────
  if (fetchState === 'error' && !session) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <AlertTriangle size={48} color="var(--error)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: 'var(--error)' }}>Backend Unreachable</h3>
        <p className="text-muted" style={{ margin: '12px 0 8px' }}>
          {backendError}
        </p>
        <p className="text-muted" style={{ marginBottom: '32px', fontSize: '0.9rem' }}>
          Ensure the FastAPI backend is running on <code>http://localhost:8000</code>.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/history')}>
            <ChevronLeft size={18} /> History
          </button>
          <button className="btn btn-primary" onClick={fetchData}>
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Guard: first load ─────────────────────────────────────────────────────
  if (fetchState === 'loading' && !session) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <Loader2 size={48} color="var(--primary)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p className="text-muted">Connecting to extraction engine…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) return null;

  const safeLogs: string[] = Array.isArray(session.logs) ? session.logs : [];
  const progress = session.total_tasks > 0
    ? Math.round((session.completed_tasks / session.total_tasks) * 100)
    : 0;

  const isRunning = session.status === 'running' || session.status === 'pending';
  const isDone = session.status === 'completed';
  const isFailed = session.status === 'failed';

  const statusBadgeClass = isDone
    ? 'badge-success'
    : isFailed
    ? 'badge-error'
    : 'badge-warning';

  const successTasks = tasks.filter(t => t.status === 'success');
  const failedTasks = tasks.filter(t => t.status === 'failed');

  return (
    <div className="card animate-in">

      {/* ── Header ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '6px' }}>
            {session.name || `Session #${id}`}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Job ID: {id}
            {session.created_at && ` · Started ${new Date(session.created_at).toLocaleString()}`}
            {backendError && (
              <span style={{ color: 'var(--error)', marginLeft: '12px' }}>
                ⚠ Sync issue: {backendError}
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate('/history')}>
            <ChevronLeft size={18} /> Back
          </button>
          <button className="btn btn-outline" onClick={fetchData} title="Manual refresh">
            <RefreshCw size={16} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/results/${id}`)}
            disabled={session.completed_tasks === 0}
          >
            View Extracted Dataset
          </button>
        </div>
      </header>

      {/* ── Progress Bar ── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="text-muted" style={{ fontWeight: 600 }}>
            {isRunning ? 'Processing' : 'Processed'}: {session.completed_tasks} / {session.total_tasks} entities
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isRunning && (
              <Loader2 size={14} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
            )}
            <span
              className={`badge ${statusBadgeClass}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isDone && <CheckCircle size={12} />}
              {isFailed && <XCircle size={12} />}
              {isRunning && <Clock size={12} />}
              {session.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{
          width: '100%', height: '12px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '6px', overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: isFailed
              ? 'var(--error)'
              : 'linear-gradient(90deg, #BC3F00, #E65100)',
            transition: 'width 0.8s ease',
            borderRadius: '6px',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.82rem' }}>
          <span className="text-muted">✓ {successTasks.length} verified</span>
          <span style={{ color: 'var(--text-muted)' }}>{progress}%</span>
          <span style={{ color: failedTasks.length > 0 ? 'var(--error)' : 'var(--text-muted)' }}>
            ✗ {failedTasks.length} failed
          </span>
        </div>
      </div>

      {/* ── Task Grid ── */}
      <h3 style={{ marginBottom: '20px', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        Entity Processing Monitor
        {isRunning && (
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>LIVE</span>
        )}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>

        {/* Empty state while scanning */}
        {tasks.length === 0 && isRunning && (
          <div className="status-row" style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <Loader2 size={20} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            Scanning source directory and dispatching AI inference agents…
          </div>
        )}

        {/* Empty state when finished with no tasks */}
        {tasks.length === 0 && !isRunning && (
          <div className="status-row" style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <AlertTriangle size={20} color="var(--error)" style={{ flexShrink: 0 }} />
            No entity results returned. The session may have encountered a source directory issue.
          </div>
        )}

        {/* Success tasks */}
        {successTasks.map((t, i) => (
          <div
            key={`ok-${i}`}
            className="status-row"
            style={{ border: '1px solid rgba(46, 204, 113, 0.15)' }}
          >
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              background: 'rgba(46,204,113,0.08)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Folder size={18} color="var(--success)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.folder_name}
              </div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>Extraction verified</div>
            </div>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <CheckCircle size={11} /> OK
            </span>
          </div>
        ))}

        {/* Failed tasks */}
        {failedTasks.map((t, i) => (
          <div
            key={`fail-${i}`}
            className="status-row"
            style={{ border: '1px solid rgba(231, 76, 60, 0.2)' }}
          >
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              background: 'rgba(231,76,60,0.06)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertTriangle size={18} color="var(--error)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--error)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.folder_name}
              </div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                {t.error ? t.error.split(':').pop()?.trim() : 'Extraction failed'}
              </div>
            </div>
            <span className="badge badge-error" style={{ flexShrink: 0 }}>ERR</span>
          </div>
        ))}

        {/* Pending tasks inferred from session count */}
        {isRunning && session.total_tasks > tasks.length && Array.from({
          length: Math.max(0, session.total_tasks - tasks.length)
        }).slice(0, 6).map((_, i) => (
          <div
            key={`pend-${i}`}
            className="status-row"
            style={{ border: '1px solid var(--border)', opacity: 0.5 }}
          >
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              background: 'var(--accent)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Clock size={18} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Entity {tasks.length + i + 1}</div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>Queued for processing…</div>
            </div>
            <span className="badge badge-warning" style={{ flexShrink: 0 }}>QUEUE</span>
          </div>
        ))}
      </div>

      {/* ── Session Logs ── */}
      {safeLogs.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Session Logs</h3>
          <div style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: '14px',
            padding: '20px', border: '1px solid var(--border)',
            maxHeight: '200px', overflowY: 'auto',
            fontFamily: 'monospace', fontSize: '0.82rem',
            lineHeight: '1.8', color: 'var(--text-muted)'
          }}>
            {safeLogs.map((log, i) => (
              <div key={i} style={{ color: log.toLowerCase().includes('error') || log.toLowerCase().includes('fail') ? 'var(--error)' : 'inherit' }}>
                <span style={{ opacity: 0.5, marginRight: '12px' }}>[{String(i + 1).padStart(3, '0')}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Last Refresh ── */}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <span className="text-muted" style={{ fontSize: '0.78rem' }}>
          Last synced: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 3s
        </span>
      </div>
    </div>
  );
};

export default SessionStatus;
