import React, { useEffect, useState } from 'react';
import { apiGet, getApiBaseUrl } from '../api/client';

const styles = {
  appBar: {
    backgroundColor: '#1E3A8A', // Corporate Navy primary
    color: '#FFFFFF',
    padding: '12px 16px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },
  container: {
    padding: 16,
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    color: '#111827',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    maxWidth: 720,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#F59E0B', // secondary accent
    color: '#111827',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
  },
  mono: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: 13,
    background: '#F3F4F6',
    padding: '8px 10px',
    borderRadius: 6,
    overflowX: 'auto',
  },
};

export default function Home() {
  const [apiBase, setApiBase] = useState(getApiBaseUrl());
  const [health, setHealth] = useState(null);
  const [hello, setHello] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const [h, he] = await Promise.all([
        apiGet('/api/health'),
        apiGet('/api/hello'),
      ]);
      setHealth(h);
      setHello(he);
    } catch (e) {
      setError(e?.data || e?.message || 'Unknown error');
    }
  };

  useEffect(() => {
    setApiBase(getApiBaseUrl());
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <header style={styles.appBar}>
        <strong>AI Digitest</strong> — Connectivity Check
      </header>
      <main style={styles.container}>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Backend Connectivity</h2>
          <p>
            Using API base URL:&nbsp;
            <code style={styles.mono}>{apiBase || '(not set)'}</code>
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button style={styles.button} onClick={load}>Re-test</button>
          </div>
          {error && (
            <div style={{ color: '#DC2626', marginBottom: 12 }}>
              Error: {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <div><strong>GET /api/health</strong></div>
            <pre style={styles.mono}>{JSON.stringify(health, null, 2) || '...'}</pre>
          </div>
          <div>
            <div><strong>GET /api/hello</strong></div>
            <pre style={styles.mono}>{JSON.stringify(hello, null, 2) || '...'}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}
