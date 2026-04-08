import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_FIELDS = [
  "Vehicle Number", "Engine Number", "Owner Name", "Chassis Number",
  "Registration Date", "Manufacturing Year", "Fuel Type", "Vehicle Model",
  "Insurance Details", "Odometer Reading"
];

const ConfigureSession = () => {
    const navigate = useNavigate();
    const [model, setModel] = useState('llama3');
    const [apiKey, setApiKey] = useState('');
    const [folderPath, setFolderPath] = useState('');
    const [sessionName, setSessionName] = useState('');
    const [selectedFields, setSelectedFields] = useState<string[]>(DEFAULT_FIELDS);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:8000/api/sessions/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey ? `Bearer ${apiKey}` : ''
                },
                body: JSON.stringify({
                   name: sessionName || `Session-${Date.now().toString().slice(-4)}`,
                   folder_path: folderPath,
                   fields: selectedFields,
                   model_name: model
                })
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/status/${data.id}`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.detail || 'Unknown error'}`);
            }
        } catch (err) {
            alert('Could not connect to backend server. Make sure it is running on port 8000.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleField = (field: string) => {
        setSelectedFields(prev => 
            prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
        );
    };

    return (
        <div className="glass-panel card animate-in">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
                <h2 style={{ marginBottom: 0 }}>Configure Extraction Session</h2>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Session Name (Optional)</label>
                    <input 
                       type="text" 
                       placeholder="e.g., Weekly Audit" 
                       value={sessionName}
                       onChange={(e) => setSessionName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Extraction Source (Root Folder Path)</label>
                    <input 
                       type="text" 
                       required 
                       placeholder="/Users/username/Documents/Invoices" 
                       value={folderPath}
                       onChange={(e) => setFolderPath(e.target.value)}
                    />
                    <small style={{ color: 'var(--text-muted)' }}>Path must be accessible from where the backend is running.</small>
                </div>

                <div className="input-group">
                    <label>AI Model Provider</label>
                    <select value={model} onChange={(e) => setModel(e.target.value)}>
                        <option value="llama3">Ollama: Llama 3 (Local)</option>
                        <option value="mistral">Ollama: Mistral (Local)</option>
                        <option value="mixtral">Ollama: Mixtral (Local)</option>
                        <option value="gpt-4o">Copilot / OpenAI GPT-4o</option>
                    </select>
                </div>

                {model.includes('gpt') && (
                    <div className="input-group">
                        <label>Copilot / OpenAI API Key</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="sk-..." 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                )}

                <div className="input-group">
                    <label>Fields to Extract</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {DEFAULT_FIELDS.map(f => (
                            <button 
                                key={f}
                                type="button"
                                className={`badge ${selectedFields.includes(f) ? 'badge-completed' : 'btn-secondary'}`}
                                style={{ border: 'none', cursor: 'pointer', padding: '10px 16px' }}
                                onClick={() => toggleField(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '40px' }}>
                     <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
                         {isLoading ? 'Initializing...' : '🚀 Start Extraction'}
                     </button>
                </div>
            </form>
        </div>
    );
};

export default ConfigureSession;
