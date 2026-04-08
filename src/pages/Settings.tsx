import React, { useState, useEffect } from 'react';
import { Sun, Moon, Save, Database, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [ollamaUrl, setOllamaUrl] = useState(localStorage.getItem('ollama_url') || 'http://localhost:11434');
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key') || '');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const saveSettings = () => {
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ollama_url', ollamaUrl);
    alert('System Configuration Updated.');
  };

  return (
    <div className="card animate-in" style={{ maxWidth: '700px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            System Administration
        </h2>
        <p className="text-muted">Configure enterprise-level parameters and session defaults.</p>
      </header>

      <div className="input-group" style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            User Interface Preferences
        </h3>
        <div style={{ display: 'flex', gap: '14px' }}>
          <button 
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTheme('light')}
          >
            <Sun size={18} /> Light Theme
          </button>
          <button 
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTheme('dark')}
          >
            <Moon size={18} /> Dark Theme
          </button>
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="var(--primary)" /> API Core Configuration
        </h3>
        <div style={{ marginBottom: '24px' }}>
          <label>Ollama Endpoint URL</label>
          <input 
            type="text" 
            value={ollamaUrl} 
            onChange={(e) => setOllamaUrl(e.target.value)} 
            placeholder="http://localhost:11434"
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--primary)" /> Organizational API Secret (Restricted)
          </label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk-..."
          />
        </div>
      </div>

      <div style={{ marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={saveSettings}>
          <Save size={18} /> Apply Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
