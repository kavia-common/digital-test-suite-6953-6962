/**
 * Simple API client for the Digitest frontend.
 * Resolves base URL from environment variables:
 * - REACT_APP_API_BASE (preferred)
 * - REACT_APP_BACKEND_URL (fallback)
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Determine the API base URL from environment variables. */
  const base =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    '';
  // Normalize: remove trailing slash
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

// PUBLIC_INTERFACE
export async function apiGet(path, options = {}) {
  /** Perform a GET request to the backend API with JSON handling and error checks. */
  const base = getApiBaseUrl();
  const url =
    path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await resp.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!resp.ok) {
    const err = new Error(`Request failed ${resp.status}`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}
