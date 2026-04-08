import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

        fetchResults();
    }, [id]);

    if (results.length === 0 && !isLoading) {
        return <div className="card">No data found or extraction in progress...</div>;
    }

    // Get unique keys from all results for table headers
    const allKeys = Array.from(new Set(results.flatMap(r => Object.keys(r.extracted_json))));

    return (
        <div className="card animate-in" style={{ width: '100%', overflowX: 'auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    <h2>Extracted Data (Session {id})</h2>
                    <p className="text-muted">Review and verify data extracted from the document batch.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
                    <button className="btn btn-primary" onClick={() => window.open(`http://localhost:8000/api/sessions/${id}/download`)}>
                        Download XLSX
                    </button>
                </div>
            </header>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'var(--bg-sidebar)', borderRadius: '12px' }}>
                        <th style={{ padding: '20px' }}>Folder / Entity</th>
                        {allKeys.map(key => (
                            <th key={key} style={{ padding: '20px', whiteSpace: 'nowrap' }}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {results.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '20px', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{r.folder_name}</td>
                            {allKeys.map(key => (
                                <td key={`${i}-${key}`} style={{ padding: '20px', color: r.extracted_json[key] ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                    {r.extracted_json[key] || '---'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Results;
