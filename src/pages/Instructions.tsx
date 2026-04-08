import React from 'react';
import { useNavigate } from 'react-router-dom';

const Instructions = () => {
    const navigate = useNavigate();

    return (
        <div className="glass-panel card animate-in">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Back</button>
                <h2 style={{ marginBottom: 0 }}>System Instructions</h2>
            </header>

            <div style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>📂 Folder Structure Requirement</h3>
                    <p>The system expects a root folder containing multiple subfolders. Each subfolder represents a single entity (e.g., a vehicle) and should contain:</p>
                    <ul style={{ marginLeft: '24px', marginTop: '10px', listStyleType: 'disc' }}>
                        <li>One <strong>PDF</strong> file (e.g., invoices, registration).</li>
                        <li>One <strong>Word</strong> file (.docx or .doc) with supplementary details.</li>
                    </ul>
                    <p style={{ marginTop: '12px' }}>Example:</p>
                    <pre style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '8px' }}>
                        Root_Folder/<br />
                        ├── Vehicle_A/<br />
                        │   ├── doc_A.pdf<br />
                        │   └── info_A.docx<br />
                        ├── Vehicle_B/<br />
                        │   ├── doc_B.pdf<br />
                        │   └── info_B.docx
                    </pre>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>🤖 LLM Setup</h3>
                    <h4 style={{ color: 'var(--text-main)', marginTop: '16px' }}>Option 1: Local Ollama (Recommended)</h4>
                    <p>1. Install <a href="https://ollama.com" target="_blank" style={{ color: 'var(--primary)' }}>Ollama</a> on your machine.</p>
                    <p>2. Pull a model (e.g., <code>ollama pull llama3</code>).</p>
                    <p>3. Ensure Ollama is running before starting a session.</p>

                    <h4 style={{ color: 'var(--text-main)', marginTop: '16px' }}>Option 2: Copilot / OpenAI</h4>
                    <p>1. Select "GPT-4o" from the model list.</p>
                    <p>2. Provide your API key in the configuration screen.</p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>🚀 How to Use</h3>
                    <ol style={{ marginLeft: '24px', listStyleType: 'decimal' }}>
                        <li>Navigate to the **Dashboard** and click **Start New Session**.</li>
                        <li>Enter the **Root Folder Path** (full absolute path on your system).</li>
                        <li>Select the desired **AI Model**.</li>
                        <li>Select or add the **Fields** you wish to extract.</li>
                        <li>Click **Start Extraction** and watch the progress in real-time.</li>
                        <li>Download the final **Excel** file once completed.</li>
                    </ol>
                </section>

                <section>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>💡 Tips</h3>
                    <ul style={{ marginLeft: '24px', listStyleType: 'disc' }}>
                        <li>The system automatically merges text from both PDF and Word documents for each subfolder.</li>
                        <li>For local models, use a GPU for faster processing.</li>
                        <li>If the extraction is inaccurate, try a larger model (e.g., Llama3 70B if hardware permits).</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Instructions;
