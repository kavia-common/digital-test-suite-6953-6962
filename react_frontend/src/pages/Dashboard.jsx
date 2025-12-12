import React, { useEffect, useState } from 'react';
import { getTestAnalytics } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Dashboard shows analytics summary for tests and submissions.
 */
export default function Dashboard() {
  const [stats, setStats] = useState({
    total_tests: 0,
    total_submissions: 0,
    avg_score: 0,
    pass_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await getTestAnalytics();
        if (!mounted) return;
        setStats({
          total_tests: data.total_tests ?? 0,
          total_submissions: data.total_submissions ?? 0,
          avg_score: data.avg_score ?? 0,
          pass_rate: data.pass_rate ?? 0,
        });
      } catch (e) {
        if (mounted) setErr(e.message || 'Failed to load analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    // no interval to avoid noisy backend; manual refresh could be added later
    return () => { mounted = false; };
  }, []);

  return (
    <div className="dashboard">
      <h1 className="section-title">Dashboard</h1>
      {err && <div className="card" style={{ borderColor: 'rgba(220,38,38,0.3)' }}>{err}</div>}
      <div className="grid four">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="badge">Total Tests</div>
              <h2 style={{ margin: '8px 0 0 0' }}>{loading ? '—' : stats.total_tests}</h2>
            </div>
            <span role="img" aria-label="tests" style={{ fontSize: 28 }}>🧪</span>
          </div>
        </div>
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="badge">Submissions</div>
              <h2 style={{ margin: '8px 0 0 0' }}>{loading ? '—' : stats.total_submissions}</h2>
            </div>
            <span role="img" aria-label="submissions" style={{ fontSize: 28 }}>📨</span>
          </div>
        </div>
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="badge">Average Score</div>
              <h2 style={{ margin: '8px 0 0 0' }}>{loading ? '—' : Number(stats.avg_score).toFixed(1)}%</h2>
            </div>
            <span role="img" aria-label="score" style={{ fontSize: 28 }}>📈</span>
          </div>
        </div>
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="badge">Pass Rate</div>
              <h2 style={{ margin: '8px 0 0 0' }}>{loading ? '—' : Number(stats.pass_rate).toFixed(1)}%</h2>
            </div>
            <span role="img" aria-label="pass" style={{ fontSize: 28 }}>✅</span>
          </div>
        </div>
      </div>
    </div>
  );
}
