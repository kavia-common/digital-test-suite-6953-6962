const readJson = (val) => {
  try {
    if (!val) return {};
    return JSON.parse(val);
  } catch {
    return {};
  }
};

// PUBLIC_INTERFACE
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL.replace(/\/+$/, '')}/api` : null) ||
  'http://localhost:3001/api';

// PUBLIC_INTERFACE
export const FEATURE_FLAGS = readJson(process.env.REACT_APP_FEATURE_FLAGS);

// PUBLIC_INTERFACE
export const EXPERIMENTS_ENABLED = String(process.env.REACT_APP_EXPERIMENTS_ENABLED || '').toLowerCase() === 'true';

// PUBLIC_INTERFACE
export const HEALTHCHECK_PATH = process.env.REACT_APP_HEALTHCHECK_PATH || '/api/health';
