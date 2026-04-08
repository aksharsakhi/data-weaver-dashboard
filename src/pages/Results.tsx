import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2,
  ServerOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Fixed brake-test extraction schema — must match backend field names
const BRAKE_TEST_COLUMNS: { label: string; key: string }[] = [
  { label: 'Sr No',                       key: 'Sr No' },
  { label: 'VC Number',                   key: 'VC Number' },
  { label: 'Vehicle Description',         key: 'Vehicle Description' },
  { label: 'Base VC',                     key: 'Base VC' },
  { label: 'Vehicle Details (12V/24V)',   key: 'Vehicle Details (12V/24V)' },
  { label: 'No of Gears',                 key: 'No of Gears' },
  { label: 'Wheel Base',                  key: 'Wheel Base' },
  { label: 'Max Speed (km/h)',            key: 'Max Speed (km/h)' },
  { label: 'ABS',                         key: 'ABS' },
  { label: 'Pedal Force (N)',             key: 'Pedal Force (N)' },
  { label: 'L/R Balance % (Front)',       key: 'L/R Balance % (Front)' },
  { label: 'Cruise Control',             key: 'Cruise Control' },
  { label: 'Normal Brake Force Front (N)',key: 'Normal Brake Force Front (N)' },
  { label: 'Normal Brake Force Rear (N)', key: 'Normal Brake Force Rear (N)' },
  { label: 'Wheel Drag Force Front (N)', key: 'Wheel Drag Force Front (N)' },
  { label: 'Wheel Drag Force Rear (N)',  key: 'Wheel Drag Force Rear (N)' },
  { label: 'Parking Brake Force (N)',    key: 'Parking Brake Force (N)' },
  { label: 'Added By',                   key: 'Added By' },
  { label: 'Date',                       key: 'Date' },
];

interface TaskResult {
  folder_name: string;
  status: 'success' | 'failed';
  extracted_json?: Record<string, string | number | null>;
  error?: string;
}

const API_BASE = 'http://localhost:8000/api';

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<TaskResult[]>([]);
  const [columns, setColumns] = useState<{label: string, key: string}[]>(BRAKE_TEST_COLUMNS);
  const [isLoading, setIsLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setBackendDown(false);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/sessions/${id}/results`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || `Server returned ${res.status}`);
      }
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [];
      setResults(rows);

      // Determine dynamic columns based on extracted_json keys
      const baseKeys = new Set(BRAKE_TEST_COLUMNS.map(c => c.key));
      const extraCols = new Set<string>();
      rows.forEach((r: TaskResult) => {
        if (r.extracted_json) {
          Object.keys(r.extracted_json).forEach(k => {
            if (!baseKeys.has(k)) extraCols.add(k);
          });
        }
      });
      
      const newCols = [...BRAKE_TEST_COLUMNS];
      extraCols.forEach(k => newCols.push({ label: k, key: k }));
      setColumns(newCols);

    } catch (err: any) {
      setBackendDown(true);
      setErrorMsg(err?.message || 'Failed to load results.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleDownload = () => {
    window.open(`${API_BASE}/sessions/${id}/download`, '_blank');
  };

  const getCellValue = (row: TaskResult, key: string): string => {
    if (row.status === 'failed') return '—';
    const val = row.extracted_json?.[key];
    if (val === null || val === undefined || val === '') return '—';
    return String(val);
  };

  // ── Guard: no ID ──────────────────────────────────────────────────────────
  if (!id) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <AlertTriangle size={48} color="var(--error)" style={{ margin: '0 auto 16px' }} />
        <h3>Invalid Session</h3>
        <p className="text-muted" style={{ margin: '12px 0 32px' }}>No session ID in the URL.</p>
        <button className="btn btn-primary" onClick={() => navigate('/history')}>Back to History</button>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <Loader2 size={40} color="var(--primary)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p className="text-muted">Loading extracted dataset…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Backend unreachable ───────────────────────────────────────────────────
  if (backendDown) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <ServerOff size={48} color="var(--error)" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: 'var(--error)', marginBottom: '12px' }}>Backend Unreachable</h3>
        <p className="text-muted" style={{ marginBottom: '8px' }}>{errorMsg}</p>
        <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '32px' }}>
          Ensure the backend is running on <code>http://localhost:8000</code>.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Back
          </button>
          <button className="btn btn-primary" onClick={fetchResults}>
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ── No results ────────────────────────────────────────────────────────────
  if (results.length === 0) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '60px' }}>
        <AlertTriangle size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
        <h3 style={{ marginBottom: '12px' }}>No Results Yet</h3>
        <p className="text-muted" style={{ marginBottom: '32px' }}>
          The session is still processing or no entities were found in the source directory.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/status/${id}`)}>
            View Session Monitor
          </button>
        </div>
      </div>
    );
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  return (
    <div className="card animate-in" style={{ width: '100%' }}>

      {/* ── Header ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Extracted Brake Test Data</h2>
          <p className="text-muted" style={{ marginTop: '6px', fontSize: '0.9rem' }}>
            Session #{id} · {results.length} entities · {' '}
            <span style={{ color: 'var(--success)' }}>✓ {successCount} verified</span>
            {failedCount > 0 && (
              <span style={{ color: 'var(--error)', marginLeft: '12px' }}>✗ {failedCount} failed</span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} /> Back
          </button>
          <button className="btn btn-outline" onClick={fetchResults}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={18} /> Download XLSX
          </button>
        </div>
      </header>

      {/* ── Summary Stats ── */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Entities', value: results.length, color: 'var(--primary)' },
          { label: 'Verified', value: successCount, color: 'var(--success)' },
          { label: 'Failed', value: failedCount, color: failedCount > 0 ? 'var(--error)' : 'var(--text-muted)' },
          {
            label: 'Success Rate',
            value: `${Math.round((successCount / results.length) * 100)}%`,
            color: successCount === results.length ? 'var(--success)' : 'var(--primary)'
          },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: '1', minWidth: '120px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            borderRadius: '14px', padding: '18px 20px'
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Data Table ── */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', whiteSpace: 'nowrap', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                Entity / Folder
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{
                    padding: '14px 16px', textAlign: 'left',
                    whiteSpace: 'nowrap', fontSize: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border)',
                    color: col.key === 'Added By' || col.key === 'Date' ? 'var(--primary)' : 'var(--text-muted)',
                    position: 'sticky', top: 0,
                    background: 'var(--bg-card)', zIndex: 1
                  }}
                >
                  {col.label}
                </th>
              ))}
              <th style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                  background: row.status === 'failed' ? 'rgba(231,76,60,0.03)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = row.status === 'failed' ? 'rgba(231,76,60,0.03)' : 'transparent')}
              >
                <td style={{
                  padding: '14px 16px', fontWeight: 700,
                  color: 'var(--primary)', whiteSpace: 'nowrap'
                }}>
                  {row.folder_name || `Entity ${i + 1}`}
                </td>
                {columns.map(col => {
                  const val = getCellValue(row, col.key);
                  return (
                    <td
                      key={col.key}
                      style={{
                        padding: '14px 16px',
                        whiteSpace: 'nowrap',
                        color: val === '—' ? 'var(--text-muted)' : 'var(--text-main)',
                        fontFamily: col.key.includes('Force') || col.key.includes('Speed') || col.key.includes('Base') ? 'monospace' : 'inherit',
                        fontSize: col.key.includes('Force') || col.key.includes('Speed') ? '0.9rem' : 'inherit',
                      }}
                    >
                      {val}
                    </td>
                  );
                })}
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  {row.status === 'success' ? (
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={11} /> OK
                    </span>
                  ) : (
                    <span
                      className="badge badge-error"
                      title={row.error || 'Extraction failed'}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                    >
                      <XCircle size={11} /> FAIL
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Failed rows detail ── */}
      {failedCount > 0 && (
        <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(231,76,60,0.04)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '14px' }}>
          <h4 style={{ color: 'var(--error)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> Failed Entities ({failedCount})
          </h4>
          {results.filter(r => r.status === 'failed').map((r, i) => (
            <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <strong style={{ color: 'var(--error)' }}>{r.folder_name}</strong>
              {r.error && <span> — {r.error}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;
