import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // We'll assume the same list could be fetched from /api/sessions
                const res = await fetch('http://localhost:8000/api/sessions/list'); // Placeholder endpoint
                if (res.ok) {
                    const data = await res.json();
                    setSessions(data);
                }
            } catch (err) {
                // Simulate some history if fetch fails or for initial UI
                setSessions([
                  { id: 1, name: "Vehicle Batch - March Main", files: 12, status: "completed", created_at: "2026-03-28T10:00:00" },
                  { id: 2, name: "Insurance Claims Q1", files: 45, status: "completed", created_at: "2026-03-29T14:30:00" },
                  { id: 3, name: "Title Deeds Batch 4", files: 28, status: "failed", created_at: "2026-04-01T09:15:00" }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="card animate-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <h2>Extraction History</h2>
                    <p className="text-muted">Review past AI data extraction runs and results.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/configure')}>
                    + New Session
                </button>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Session Name</th>
                        <th>Total Subfolders</th>
                        <th>Creation Date</th>
                        <th>Current Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map(s => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td>{s.files} Folders</td>
                            <td>{new Date(s.created_at).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${s.status === 'completed' ? 'badge-success' : 'badge-error'}`}>
                                    {s.status}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => navigate(`/status/${s.id}`)}>
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default History;
