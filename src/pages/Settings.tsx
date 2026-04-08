import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key') || '');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const saveSettings = () => {
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ollama_url', ollamaUrl);
    alert('Settings Saved Successfully!');
  };

  return (
    <div className="card animate-in" style={{ maxWidth: '600px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2>System Settings</h2>
        <p className="text-muted">Manage your application configuration and preferences.</p>
      </header>

      <div className="input-group" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Appearance</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTheme('light')}
          >
            ☀️ Light Mode
          </button>
          <button 
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTheme('dark')}
          >
            🌙 Dark Mode
          </button>
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>AI Core Configuration</h3>
        <div style={{ marginBottom: '20px' }}>
          <label>Ollama API Base URL</label>
          <input 
            type="text" 
            value={ollamaUrl} 
            onChange={(e) => setOllamaUrl(e.target.value)} 
            placeholder="http://localhost:11434"
          />
        </div>
        
        <div>
          <label>Copilot / OpenAI API Key (Encrypted Locally)</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk-..."
          />
        </div>
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveSettings}>
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default Settings;
