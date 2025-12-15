# React Frontend - AI Digitest

This frontend performs a basic connectivity check to the backend.

How it works:
- Reads API base URL from REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL.
- Calls GET /api/health and GET /api/hello on load and displays responses.

Configure:
- Copy .env.example to .env and set the backend URL if needed.

Run:
- Use the existing start mechanism for this container (no changes made here).
