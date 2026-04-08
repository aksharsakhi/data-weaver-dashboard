import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Folder, AlertTriangle, PlayControl as Play, CheckCircle, ChevronLeft, Download } from 'lucide-react';

const SessionStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/sessions/${id}/status`);
                if (res.ok) {
                    const data = await res.json();
                    setSession(data);
                }
            } catch (err) {
                console.error('Error fetching session status', err);
            }
        };

        const fetchTasks = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/sessions/${id}/results`);
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                }
            } catch (err) {
                console.error('Error fetching tasks', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
        fetchTasks();
        
        const interval = setInterval(() => {
            fetchStatus();
            fetchTasks();
        }, 3000);

        return () => clearInterval(interval);
    }, [id]);

    if (!session) return <div className="card">Initializing extraction workflow...</div>;

    const progress = (session.completed_tasks / session.total_tasks) * 100;

    return (
        <div className="card animate-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Session Monitor: {session.name}</h2>
                    <p className="text-muted">Job ID {id} • Full directory extraction in progress...</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>
                        <ChevronLeft size={18} /> Back
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/results/${id}`)} disabled={session.completed_tasks === 0}>
                        View Extracted Dataset
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 600 }}>
                    <span className="text-muted">Entity Processing: {session.completed_tasks} / {session.total_tasks} completed</span>
                    <span className={`badge ${session.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {session.status.toUpperCase()}
                    </span>
                </div>
                <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #BC3F00, #E65100)', transition: 'width 0.8s' }} />
                </div>
            </div>

            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Active Workflow Monitor
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {tasks.length === 0 ? (
                    <div className="status-row" style={{ color: 'var(--text-muted)' }}>
                        System scanning source directory and initializing AI agents...
                    </div>
                ) : (
                    tasks.map((t, i) => (
                        <div key={i} className="status-row" style={{ border: '1px solid var(--border)' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Folder size={20} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{t.folder_name}</div>
                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Extraction Verified</div>
                            </div>
                            <span className="badge badge-success">
                                <CheckCircle size={12} /> VERIFIED
                            </span>
                        </div>
                    ))
                )}
                
                {session.logs.map((log: string, i: number) => (
                    <div key={`err-${i}`} className="status-row" style={{ border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(231, 76, 60, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={20} color="var(--error)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'var(--error)' }}>Folder Failure</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{log.split(':').pop()}</div>
                        </div>
                        <span className="badge badge-error">ERROR</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionStatus;
