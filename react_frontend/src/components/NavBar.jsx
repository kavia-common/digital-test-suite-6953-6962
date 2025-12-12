import React, { useEffect, useState } from 'react';
import { HEALTHCHECK_PATH } from '../config/env';
import { getHealth } from '../services/api';

/**
 * PUBLIC_INTERFACE
 * NavBar renders the top navigation bar with branding and backend health status.
 */
export default function NavBar() {
  const [healthy, setHealthy] = useState(null); // null: unknown, true/false: state

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await getHealth(HEALTHCHECK_PATH);
        if (!mounted) return;
        // assume any 200 response means healthy; prefer res.status === 'ok' if backend provides it
        const ok =
          res?.status?.toLowerCase?.() === 'ok' ||
          res?.healthy === true ||
          typeof res === 'object';
        setHealthy(ok);
      } catch {
        if (mounted) setHealthy(false);
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <header className="navbar" role="banner">
      <div className="brand" aria-label="App brand">
        <span className="brand-badge" aria-hidden>DT</span>
        <span>AI Digitest</span>
      </div>
      <div className="spacer" />
      <div className="health" aria-live="polite" title="Backend health">
        <span className={`dot ${healthy === null ? '' : healthy ? 'ok' : 'bad'}`} />
        <span>{healthy === null ? 'Checking...' : healthy ? 'Healthy' : 'Unreachable'}</span>
      </div>
    </header>
  );
}
