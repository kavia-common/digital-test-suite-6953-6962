import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * SideNav provides navigation links to the main sections.
 */
export default function SideNav() {
  return (
    <nav className="sidenav" aria-label="Primary">
      <div className="section">Navigation</div>
      <NavLink to="/" end className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
        <span role="img" aria-label="dashboard">📊</span>
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/tests" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
        <span role="img" aria-label="tests">🧪</span>
        <span>Test Creator</span>
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
        <span role="img" aria-label="users">👥</span>
        <span>User Management</span>
      </NavLink>
    </nav>
  );
}
