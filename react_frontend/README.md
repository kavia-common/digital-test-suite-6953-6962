# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Environment configuration and backend wiring

The frontend is pre-wired to talk to a backend API at `http://localhost:3001/api`.

- Copy `.env.example` to `.env` and adjust as needed:
  - `REACT_APP_PORT=3000`
  - `REACT_APP_API_BASE=http://localhost:3001/api`
  - Optionally use `REACT_APP_BACKEND_URL=http://localhost:3001` (the app will append `/api`)
  - Optional toggles: `REACT_APP_HEALTHCHECK_PATH`, `REACT_APP_FEATURE_FLAGS`, `REACT_APP_EXPERIMENTS_ENABLED`

- For development, a CRA proxy is configured in `package.json`:
  - `"proxy": "http://localhost:3001"`
  - This allows calling relative paths in dev and avoids CORS issues when the backend runs on port 3001.

- Health indicator:
  - The top navbar pings the backend health endpoint (`/api/health` by default). A green dot indicates healthy.

- Basic flows verified by the UI and services:
  - Tests: create, list, submit stub, evaluate (`GET/POST /api/tests`, `/api/tests/:id/submit`, `/api/tests/:id/evaluate`, `/api/tests/analytics`)
  - Users: CRUD (`GET/POST/PUT/DELETE /api/users`)

### Backend CORS

Ensure the backend allows requests from the frontend origin (e.g., http://localhost:3000) if you are not using the proxy or when running in production. Add CORS headers or enable CORS middleware accordingly.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
