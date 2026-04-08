import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CalendarDays, FolderOpen, AlertTriangle } from 'lucide-react';

// These are the extractable fields. "Added By" and "Date" are handled separately as user-input/auto fields.
const EXTRACTABLE_FIELDS = [
  "VC Number",
  "Vehicle Description",
  "Base VC",
  "Vehicle Details (12V/24V)",
  "No of Gears",
  "Wheel Base",
  "Max Speed (km/h)",
  "ABS",
  "Pedal Force (N)",
  "L/R Balance % (Front)",
  "Cruise Control",
  "Normal Brake Force Front (N)",
  "Normal Brake Force Rear (N)",
  "Wheel Drag Force Front (N)",
  "Wheel Drag Force Rear (N)",
  "Parking Brake Force (N)",
];

// Auto-format today's date as DD-MMM-YYYY (e.g. 08-Apr-2026)
const getTodayFormatted = (): string => {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ConfigureSession = () => {
    const navigate = useNavigate();
    const [model, setModel] = useState('llama3');
    const [apiKey, setApiKey] = useState('');
    const [folderPath, setFolderPath] = useState('');
    const [sessionName, setSessionName] = useState('');
    const [addedBy, setAddedBy] = useState('');
    const [availableFields, setAvailableFields] = useState<string[]>([...EXTRACTABLE_FIELDS]);
    const [selectedFields, setSelectedFields] = useState<string[]>([...EXTRACTABLE_FIELDS]);
    const [customField, setCustomField] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [autoModels, setAutoModels] = useState<string[]>([]);
    const [modelsLoading, setModelsLoading] = useState(true);

    const today = getTodayFormatted();

    useEffect(() => {
        // Auto-detect local AI models installed in Ollama
        const fetchModels = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/sessions/models');
                if (res.ok) {
                    const data = await res.json();
                    if (data.models && data.models.length > 0) {
                        setAutoModels(data.models);
                        setModel(data.models[0]); // Auto-select the first installed model
                    }
                }
            } catch (err) {
                console.error("Failed to fetch local models from backend.");
            } finally {
                setModelsLoading(false);
            }
        };
        fetchModels();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!addedBy.trim()) {
            setSubmitError('"Added By" is required. Please enter your name.');
            return;
        }

        setIsLoading(true);

        // Build final field list — always append Added By + Date as metadata
        const finalFields = [
          ...selectedFields,
          `Added By: ${addedBy.trim()}`,
          `Date: ${today}`,
        ];

        try {
            const response = await fetch('http://localhost:8000/api/sessions/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
                },
                body: JSON.stringify({
                   name: sessionName.trim() || `BrakeTest-${today}`,
                   folder_path: folderPath.trim(),
                   fields: finalFields,
                   model_name: model,
                   added_by: addedBy.trim(),
                   extraction_date: today,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/status/${data.id}`);
            } else {
                const error = await response.json().catch(() => ({}));
                setSubmitError(error?.detail || `Server returned status ${response.status}`);
            }
        } catch (err) {
            setSubmitError('Could not connect to the backend server. Make sure it is running on port 8000.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleField = (field: string) => {
        setSelectedFields(prev =>
            prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
        );
    };

    const addCustomField = () => {
        const fieldName = customField.trim();
        if (fieldName && !availableFields.includes(fieldName)) {
            setAvailableFields(prev => [...prev, fieldName]);
            setSelectedFields(prev => [...prev, fieldName]);
            setCustomField('');
        }
    };

    const selectAll = () => setSelectedFields([...availableFields]);
    const clearAll = () => setSelectedFields([]);

    return (
        <div className="card animate-in" style={{ width: '100%' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
                <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ padding: '10px 16px' }}>
                    ← Back
                </button>
                <div>
                    <h2 style={{ marginBottom: '4px' }}>Configure Extraction Session</h2>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                        Set up an AI-powered brake test data extraction run
                    </p>
                </div>
            </header>

            {submitError && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 18px', marginBottom: '24px',
                    background: 'rgba(231,76,60,0.08)',
                    border: '1px solid rgba(231,76,60,0.3)',
                    borderRadius: '12px', color: 'var(--error)',
                }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* ── Session Name ── */}
                <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                        Session Name <span className="text-muted" style={{ fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input
                       type="text"
                       placeholder={`BrakeTest-${today}`}
                       value={sessionName}
                       onChange={(e) => setSessionName(e.target.value)}
                    />
                </div>

                {/* ── Added By (required) ── */}
                <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                        <User size={15} color="var(--primary)" />
                        Added By <span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>
                    </label>
                    <input
                       type="text"
                       required
                       placeholder="Enter your full name or employee ID"
                       value={addedBy}
                       onChange={(e) => setAddedBy(e.target.value)}
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        This will be recorded in every extracted row.
                    </small>
                </div>

                {/* ── Auto Date (read-only display) ── */}
                <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                        <CalendarDays size={15} color="var(--primary)" />
                        Extraction Date <span className="text-muted" style={{ fontWeight: 400 }}>(auto)</span>
                    </label>
                    <input
                        type="text"
                        value={today}
                        readOnly
                        style={{
                            cursor: 'default',
                            background: 'rgba(255,255,255,0.01)',
                            color: 'var(--text-muted)',
                        }}
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        Today's date is captured automatically at submission time.
                    </small>
                </div>

                {/* ── Folder Path ── */}
                <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                        <FolderOpen size={15} color="var(--primary)" />
                        Source Folder Path <span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>
                    </label>
                    <input
                       type="text"
                       required
                       placeholder="C:\BrakeTestDocuments  or  /Users/name/BrakeDocs"
                       value={folderPath}
                       onChange={(e) => setFolderPath(e.target.value)}
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        Root folder containing one subfolder per vehicle entity (each with a PDF + DOCX).
                    </small>
                </div>

                {/* ── AI Model ── */}
                <div className="input-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                        <span>AI Model Provider</span>
                        <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                            {modelsLoading ? 'Scanning for local models...' : (autoModels.length > 0 ? `Auto-detected ${autoModels.length} local models` : 'No local models found')}
                        </span>
                    </label>
                    <select value={model} onChange={(e) => setModel(e.target.value)} disabled={modelsLoading}>
                        {autoModels.length > 0 ? (
                            <optgroup label="Local Models (Ollama auto-detected)">
                                {autoModels.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </optgroup>
                        ) : (
                            <optgroup label="Local Models (Manual Entry - Ollama offline?)">
                                <option value="llama3">llama3</option>
                                <option value="mistral">mistral</option>
                            </optgroup>
                        )}
                        <optgroup label="Cloud Models">
                            <option value="gpt-4o">OpenAI: GPT-4o (API Key Required)</option>
                        </optgroup>
                    </select>
                </div>

                {/* ── API Key (conditional) ── */}
                {model.includes('gpt') && (
                    <div className="input-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                            OpenAI API Key <span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="sk-..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                )}

                {/* ── Custom Field Input ── */}
                <div className="input-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.875rem' }}>
                        Add Custom Field <span className="text-muted" style={{ fontWeight: 400 }}>(e.g., Engineer Name, Weather Conditions)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                           type="text"
                           placeholder="Enter new field name..."
                           value={customField}
                           onChange={(e) => setCustomField(e.target.value)}
                           onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                   e.preventDefault();
                                   addCustomField();
                               }
                           }}
                           style={{ flex: 1 }}
                        />
                        <button type="button" className="btn btn-secondary" onClick={addCustomField} disabled={!customField.trim()}>
                            + Add Field
                        </button>
                    </div>
                </div>

                {/* ── Fields to Extract ── */}
                <div className="input-group" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Fields to Extract ({selectedFields.length}/{availableFields.length})
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={selectAll}>
                                Select All
                            </button>
                            <button type="button" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={clearAll}>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {availableFields.map(f => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => toggleField(f)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: selectedFields.includes(f)
                                        ? '1px solid var(--primary)'
                                        : '1px solid var(--border)',
                                    background: selectedFields.includes(f)
                                        ? 'var(--accent)'
                                        : 'transparent',
                                    color: selectedFields.includes(f)
                                        ? 'var(--primary)'
                                        : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: '0.82rem',
                                    fontWeight: 500,
                                    transition: 'all 0.18s',
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '10px' }}>
                        <strong style={{ color: 'var(--primary)' }}>Added By</strong> and <strong style={{ color: 'var(--primary)' }}>Date</strong> are always included automatically.
                    </small>
                </div>

                {/* ── Submit ── */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px' }}
                    disabled={isLoading}
                >
                    {isLoading ? '⏳ Initializing extraction…' : '🚀 Start Extraction Session'}
                </button>
            </form>
        </div>
    );
};

export default ConfigureSession;
