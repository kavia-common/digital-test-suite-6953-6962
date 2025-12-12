import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import SideNav from './components/SideNav';
import Dashboard from './pages/Dashboard';
import TestCreator from './pages/TestCreator';
import UserManagement from './pages/UserManagement';

/**
 * PUBLIC_INTERFACE
 * App is the root component that sets up the common layout and routes.
 */
function App() {
  return (
    <div className="app-root">
      <NavBar />
      <div className="app-body">
        <SideNav />
        <main className="app-content" role="main" aria-live="polite">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tests" element={<TestCreator />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
