import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderTree, Cpu, PlayCircle, Lightbulb, ChevronLeft } from 'lucide-react';

const Instructions = () => {
    const navigate = useNavigate();

    return (
        <div className="card animate-in">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ padding: '8px 12px' }}>
                    <ChevronLeft size={20} /> Back
                </button>
                <h2 style={{ marginBottom: 0 }}>System Instructions</h2>
            </header>

            <div style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                <section style={{ marginBottom: '48px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FolderTree size={24} color="var(--primary)" /> Folder Structure Requirement
                    </h3>
                    <p>The system expects a root folder containing multiple subfolders. Each subfolder represents a single entity (auto-dealer vehicle) and must contain:</p>
                    <ul style={{ marginLeft: '26px', marginTop: '12px', listStyleType: 'square' }}>
                        <li>Exactly one <strong>PDF</strong> document (Registration, Invoice, etc).</li>
                        <li>Exactly one <strong>Word</strong> document (.docx or .doc) with metadata.</li>
                    </ul>
                    <p style={{ marginTop: '16px' }}>Target Directory Mapping:</p>
                    <pre style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '14px', color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '12px', border: '1px solid var(--border)' }}>
                        Root_Folder/<br />
                        ├── Entity_001/<br />
                        │   ├── doc_primary.pdf<br />
                        │   └── metadata.docx<br />
                        ├── Entity_002/<br />
                        │   ├── doc_primary.pdf<br />
                        │   └── metadata.docx
                    </pre>
                </section>

                <section style={{ marginBottom: '48px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Cpu size={24} color="var(--primary)" /> AI Configuration
                    </h3>
                    <h4 style={{ color: 'var(--text-main)', marginTop: '20px' }}>Local Infrastructure (Ollama)</h4>
                    <p>1. Deploy <a href="https://ollama.com" target="_blank" style={{ color: 'var(--primary)' }}>Ollama</a> on the local server cluster.</p>
                    <p>2. Pre-fetch inference models (e.g., <code>ollama pull llama3</code>).</p>
                    <p>3. Ensure the high-performance inference engine is active before dispatching jobs.</p>

                    <h4 style={{ color: 'var(--text-main)', marginTop: '24px' }}>Enterprise Cloud (OpenAI)</h4>
                    <p>1. Select "GPT-4o" via the configuration dashboard.</p>
                    <p>2. Provide a valid organizational API key in the system settings.</p>
                </section>

                <section style={{ marginBottom: '48px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PlayCircle size={24} color="var(--primary)" /> Operational Workflow
                    </h3>
                    <ol style={{ marginLeft: '26px', listStyleType: 'decimal' }}>
                        <li>Initiate a <strong>New Extraction</strong> session from the primary dashboard.</li>
                        <li>Provide the <strong>Absolute File Path</strong> of the root directory.</li>
                        <li>Select the optimized <strong>AI Inference Model</strong>.</li>
                        <li>Configure the <strong>Schema Definition</strong> (fields to extract).</li>
                        <li>Dispatch the session and monitor real-time folder processing.</li>
                        <li>Export the final validated dataset to <strong>XLSX</strong>.</li>
                    </ol>
                </section>

                <section>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Lightbulb size={24} color="var(--primary)" /> Performance Optimization
                    </h3>
                    <ul style={{ marginLeft: '26px', listStyleType: 'square' }}>
                        <li>The system employs context-fusing to merge multi-file data sources into a single inference prompt.</li>
                        <li>Utilize NVIDIA GPU acceleration for local model inference to minimize latency.</li>
                        <li>For complex unstructured data, the "Llama3-70B" or "GPT-4o" models are recommended for higher extraction precision.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Instructions;
