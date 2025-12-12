import { API_BASE } from '../config/env';

/**
 * Helper to handle fetch responses.
 */
async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const hasJson = contentType.includes('application/json');
  const data = hasJson ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

  if (!res.ok) {
    const message = (data && data.message) || res.statusText || 'Request failed';
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

/**
 * Helper to perform JSON fetch.
 */
async function jsonFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getHealth(customPath) {
  const url = customPath
    ? customPath
    : `${API_BASE.replace(/\/+$/, '')}/health`;
  return jsonFetch(url);
}

/* Tests endpoints */

// PUBLIC_INTERFACE
export async function listTests() {
  return jsonFetch(`${API_BASE}/tests`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createTest(payload) {
  return jsonFetch(`${API_BASE}/tests`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function getTest(id) {
  return jsonFetch(`${API_BASE}/tests/${encodeURIComponent(id)}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function submitResponses(id, payload) {
  return jsonFetch(`${API_BASE}/tests/${encodeURIComponent(id)}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function evaluateTest(id) {
  return jsonFetch(`${API_BASE}/tests/${encodeURIComponent(id)}/evaluate`, {
    method: 'POST',
  });
}

// PUBLIC_INTERFACE
export async function getTestAnalytics() {
  return jsonFetch(`${API_BASE}/tests/analytics`, { method: 'GET' });
}

/* Users endpoints */

// PUBLIC_INTERFACE
export async function listUsers() {
  return jsonFetch(`${API_BASE}/users`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createUser(payload) {
  return jsonFetch(`${API_BASE}/users`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function updateUser(id, payload) {
  return jsonFetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function deleteUser(id) {
  return jsonFetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
