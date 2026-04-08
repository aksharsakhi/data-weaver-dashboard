import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SessionStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [statusData, setStatusData] = useState<any>(null);
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/sessions/${id}/status`);
                if (res.ok) {
                    const data = await res.json();
                    setStatusData(data);
                }
            } catch (err) {
                console.error('Error fetching status', err);
            }
        };

        const fetchResults = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/sessions/${id}/results`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (err) {
                console.error('Error fetching results', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
        fetchResults();
        
        const interval = setInterval(() => {
            fetchStatus();
            fetchResults();
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const handleDownload = () => {
        window.open(`http://localhost:8000/api/sessions/${id}/download`);
    };

    if (!statusData) {
        return <div className="glass-panel card">Loading session...</div>;
    }

    const progress = (statusData.completed_tasks / statusData.total_tasks) * 100;

    return (
        <div className="glass-panel card animate-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>← Back</button>
                    <h2 style={{ marginBottom: 0 }}>Session: {statusData.name}</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={handleDownload} disabled={statusData.completed_tasks === 0}>
                        Download Excel
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress ({statusData.completed_tasks} / {statusData.total_tasks})</span>
                    <span className={`badge badge-${statusData.status}`}>{statusData.status}</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, #6366f1, #d946ef)', transition: 'width 0.6s ease' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', background: 'rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Extracted Results</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {results.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>Waiting for processing to complete...</p>
                        ) : (
                            results.map((r, i) => (
                                <div key={i} style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                    <strong>{r.folder_name}</strong>
                                    <pre style={{ fontSize: '0.8rem', marginTop: '8px', color: 'var(--text-muted)', overflowX: 'auto' }}>
                                        {JSON.stringify(r.extracted_json, null, 2)}
                                    </pre>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', background: 'rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Error Logs</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {statusData.logs.length === 0 ? (
                            <p style={{ color: 'var(--success)' }}>No errors encountered.</p>
                        ) : (
                            statusData.logs.map((log: string, i: number) => (
                                <div key={i} style={{ padding: '8px', marginBottom: '8px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', borderRadius: '4px', fontSize: '0.85rem' }}>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionStatus;
